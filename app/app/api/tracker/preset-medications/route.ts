import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/tracker/preset-medications
 *
 * Create preset medications from a prescription.
 * Typically called on first app load to auto-load doctor's prescription.
 *
 * Body: {
 *   prescription: {
 *     prescribedBy: "Dr. Fernando Espinola",
 *     medications: [
 *       {
 *         name: "Cesalgin Gesic",
 *         doseMg: 37.5,
 *         category: "analgesic",
 *         frequency: "four_times",
 *         scheduledTimes: ["20:00", "20:05", "20:30", "20:35"],
 *         startDate: "2026-08-10",
 *         endDate: "2026-08-15",
 *         notes: "Gestione Gástrica"
 *       },
 *       ... more medications
 *     ]
 *   }
 * }
 *
 * Returns: {
 *   success: boolean,
 *   created: number,
 *   existing: number,
 *   medications: Medication[]
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { prescription } = body;

    if (!prescription || !prescription.medications) {
      return NextResponse.json(
        { error: 'prescription.medications is required' },
        { status: 400 }
      );
    }

    const created = [];
    const existing = [];

    for (const medData of prescription.medications) {
      try {
        // Check if medication for this date already exists
        const existingMed = await prisma.medication.findFirst({
          where: {
            userId,
            name: medData.name,
            startDate: new Date(medData.startDate),
            isActive: true,
          },
        });

        if (existingMed) {
          existing.push(existingMed);
          continue;
        }

        // Create the medication
        const med = await prisma.medication.create({
          data: {
            userId,
            name: medData.name,
            doseMg: medData.doseMg,
            unit: medData.unit || 'mg',
            category: medData.category,
            prescribedBy: prescription.prescribedBy,
            prescribedDate: new Date(),
            startDate: new Date(medData.startDate),
            endDate: medData.endDate ? new Date(medData.endDate) : null,
            frequency: medData.frequency,
            timesPerDay: medData.scheduledTimes?.length || 1,
            scheduledTimes: medData.scheduledTimes || [],
            isActive: true,
            autoNotify: true,
            notes: medData.notes,
          },
          include: {
            doses: false,
          },
        });

        // Create dose records for each scheduled time today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Only create dose records if medication starts today or in the past
        const medStart = new Date(medData.startDate);
        medStart.setHours(0, 0, 0, 0);

        if (medStart <= today) {
          for (const time of (medData.scheduledTimes || [])) {
            const [hours, minutes] = time.split(':').map(Number);
            const doseDate = new Date(today);
            doseDate.setHours(hours, minutes, 0, 0);

            await prisma.medicationDose.create({
              data: {
                userId,
                medicationId: med.id,
                doseDate,
                taken: false,
              },
            });
          }
        }

        created.push(med);
      } catch (medError: any) {
        console.error('[preset-medications] Med creation error:', medError);
        throw new Error(`Failed to create medication "${medData.name}": ${medError.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      created: created.length,
      existing: existing.length,
      medications: [...created, ...existing],
    });
  } catch (error: any) {
    console.error('[preset-medications] Error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tracker/preset-medications
 *
 * Get active medications for today.
 * Include dose schedule for reminder notifications.
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get active medications for today
    const medications = await prisma.medication.findMany({
      where: {
        userId,
        isActive: true,
        startDate: { lte: tomorrow },
        OR: [
          { endDate: null },
          { endDate: { gte: today } },
        ],
      },
      include: {
        doses: {
          where: {
            doseDate: {
              gte: today,
              lt: tomorrow,
            },
          },
          orderBy: { doseDate: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      today: today.toISOString(),
      medications,
      totalScheduledDoses: medications.reduce((sum, m) => sum + m.doses.length, 0),
      totalTakenDoses: medications.reduce(
        (sum, m) => sum + m.doses.filter(d => d.taken).length,
        0
      ),
    });
  } catch (error: any) {
    console.error('[preset-medications] GET Error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
