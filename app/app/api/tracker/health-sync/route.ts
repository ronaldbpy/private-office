import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/tracker/health-sync
 *
 * Get all health data (weights, medications, doses) for a date.
 * Query params:
 *   - date: YYYY-MM-DD (default: today)
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    // Get weights for this date
    const weights = await prisma.healthWeight.findMany({
      where: {
        userId,
        date: {
          gte: date,
          lt: nextDay,
        },
      },
      orderBy: { date: 'desc' },
    });

    // Get active medications
    const medications = await prisma.medication.findMany({
      where: {
        userId,
        isActive: true,
        startDate: { lte: nextDay },
        OR: [
          { endDate: null },
          { endDate: { gte: date } },
        ],
      },
      include: {
        doses: {
          where: {
            doseDate: {
              gte: date,
              lt: nextDay,
            },
          },
          orderBy: { doseDate: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      date: date.toISOString().split('T')[0],
      weights,
      medications,
      summary: {
        latestWeight: weights.length > 0 ? weights[0].weightKg : null,
        totalMedications: medications.length,
        totalScheduledDoses: medications.reduce((sum, m) => sum + m.doses.length, 0),
        totalTakenDoses: medications.reduce(
          (sum, m) => sum + m.doses.filter(d => d.taken).length,
          0
        ),
      },
    });
  } catch (error: any) {
    console.error('[health-sync] GET Error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tracker/health-sync
 *
 * Bulk sync health data.
 *
 * Body: {
 *   weights?: Array<{ date: string, weightKg: number, notes?: string }>,
 *   medications?: Array<{ ... }>,
 *   doseTaken?: Array<{ doseId: string, taken: boolean }>
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { weights = [], medications = [], doseTaken = [] } = body;

    const results = {
      weightsUpserted: 0,
      medicationsCreated: 0,
      dosesUpdated: 0,
      errors: [] as string[],
    };

    // Upsert weights
    for (const w of weights) {
      try {
        const weightDate = new Date(w.date);
        weightDate.setHours(0, 0, 0, 0);

        await prisma.healthWeight.upsert({
          where: {
            userId_date_weightKg: {
              userId,
              date: weightDate,
              weightKg: w.weightKg,
            },
          },
          update: {
            notes: w.notes,
            updatedAt: new Date(),
          },
          create: {
            userId,
            date: weightDate,
            weightKg: w.weightKg,
            source: 'manual_entry',
            notes: w.notes,
          },
        });
        results.weightsUpserted++;
      } catch (e: any) {
        results.errors.push(`Weight sync error: ${e.message}`);
      }
    }

    // Update doses
    for (const d of doseTaken) {
      try {
        const dose = await prisma.medicationDose.findUnique({
          where: { id: d.doseId },
        });

        if (dose && dose.userId === userId) {
          await prisma.medicationDose.update({
            where: { id: d.doseId },
            data: {
              taken: d.taken,
              takenAt: d.taken ? new Date() : null,
            },
          });
          results.dosesUpdated++;
        }
      } catch (e: any) {
        results.errors.push(`Dose sync error: ${e.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error: any) {
    console.error('[health-sync] POST Error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
