import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/tracker/medication-doses
 *
 * Record that a dose was taken.
 *
 * Body: {
 *   doseId: string,  // MedicationDose.id
 *   taken: boolean,  // true = taken, false = missed
 *   takenAt?: string (ISO timestamp)
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { doseId, taken, takenAt } = body;

    if (!doseId) {
      return NextResponse.json({ error: 'doseId is required' }, { status: 400 });
    }

    const dose = await prisma.medicationDose.findUnique({
      where: { id: doseId },
      include: { medication: true },
    });

    if (!dose || dose.userId !== userId) {
      return NextResponse.json({ error: 'Dose not found' }, { status: 404 });
    }

    const updated = await prisma.medicationDose.update({
      where: { id: doseId },
      data: {
        taken,
        takenAt: taken ? new Date(takenAt || new Date()) : null,
      },
    });

    return NextResponse.json({
      success: true,
      dose: updated,
    });
  } catch (error: any) {
    console.error('[medication-doses] POST Error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tracker/medication-doses
 *
 * Query medication doses by date range.
 * ?startDate=2026-08-10&endDate=2026-08-15
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');

    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    let endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    if (startDateStr) {
      startDate = new Date(startDateStr);
      startDate.setHours(0, 0, 0, 0);
    }

    if (endDateStr) {
      endDate = new Date(endDateStr);
      endDate.setHours(23, 59, 59, 999);
    }

    const doses = await prisma.medicationDose.findMany({
      where: {
        userId,
        doseDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        medication: true,
      },
      orderBy: { doseDate: 'asc' },
    });

    return NextResponse.json({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      doses,
      summary: {
        total: doses.length,
        taken: doses.filter(d => d.taken).length,
        missed: doses.filter(d => !d.taken).length,
        adherencePercent: doses.length > 0
          ? Math.round((doses.filter(d => d.taken).length / doses.length) * 100)
          : 0,
      },
    });
  } catch (error: any) {
    console.error('[medication-doses] GET Error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
