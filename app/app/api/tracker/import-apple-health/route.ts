import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/tracker/import-apple-health
 *
 * Import weight records from Apple Health XML export.
 *
 * Body: {
 *   xmlData: string,  // XML content from export.xml
 *   deduplicateWithin: {
 *     days: number,    // default 1 (±1 day)
 *     weightVarianceKg: number // default 0.5
 *   }
 * }
 *
 * Returns: {
 *   success: boolean,
 *   imported: number,
 *   skipped: number,
 *   duplicates: number,
 *   errors: string[],
 *   logId: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const xmlData = body.xmlData as string;
    const deduplicateWithin = body.deduplicateWithin || { days: 1, weightVarianceKg: 0.5 };

    if (!xmlData) {
      return NextResponse.json({ error: 'xmlData is required' }, { status: 400 });
    }

    // Parse Apple Health XML using regex
    // Extract all weight records (HKQuantityTypeIdentifierBodyMass with unit="kg")
    const weightRecordRegex = /<Record[^>]*type="HKQuantityTypeIdentifierBodyMass"[^>]*unit="kg"[^>]*value="([^"]+)"[^>]*startDate="([^"]+)"[^>]*\/>/g;

    const weightRecords: Array<{ value: string; startDate: string; sourceName: string }> = [];
    let match;

    while ((match = weightRecordRegex.exec(xmlData)) !== null) {
      // Also extract sourceName from the full Record tag
      const recordMatch = xmlData.substring(Math.max(0, match.index - 200), match.index + 300);
      const sourceMatch = /sourceName="([^"]+)"/.exec(recordMatch);

      weightRecords.push({
        value: match[1],
        startDate: match[2],
        sourceName: sourceMatch ? sourceMatch[1] : 'apple_health',
      });
    }

    if (weightRecords.length === 0) {
      return NextResponse.json({
        error: 'No weight records found in XML',
        info: 'The XML must contain records with type="HKQuantityTypeIdentifierBodyMass" and unit="kg"',
      }, { status: 400 });
    }

    console.log(`[apple-health-import] Found ${weightRecords.length} weight records`);

    const imported: typeof weightRecords = [];
    const skipped: typeof weightRecords = [];
    const duplicates: typeof weightRecords = [];
    const errors: string[] = [];

    // Process each weight record
    for (const record of weightRecords) {
      try {
        const weightKg = parseFloat(record.value);
        const startDate = new Date(record.startDate);

        if (isNaN(weightKg) || isNaN(startDate.getTime())) {
          errors.push(`Invalid weight or date: ${record.value} | ${record.startDate}`);
          skipped.push(record);
          continue;
        }

        // Check for duplicates within tolerance
        const dateRangeStart = new Date(startDate);
        dateRangeStart.setDate(dateRangeStart.getDate() - deduplicateWithin.days);

        const dateRangeEnd = new Date(startDate);
        dateRangeEnd.setDate(dateRangeEnd.getDate() + deduplicateWithin.days);

        const existingRecord = await prisma.healthWeight.findFirst({
          where: {
            userId,
            date: {
              gte: dateRangeStart,
              lte: dateRangeEnd,
            },
            weightKg: {
              gte: weightKg - deduplicateWithin.weightVarianceKg,
              lte: weightKg + deduplicateWithin.weightVarianceKg,
            },
          },
        });

        if (existingRecord) {
          console.log(`[apple-health-import] Duplicate found: ${weightKg}kg on ${startDate.toISOString()}`);
          duplicates.push(record);
          skipped.push(record);
          continue;
        }

        // Insert new weight record
        await prisma.healthWeight.create({
          data: {
            userId,
            date: startDate,
            weightKg,
            source: record.sourceName || 'apple_health',
            sourceRecordId: `${record.sourceName}_${startDate.getTime()}`,
          },
        });

        imported.push(record);
      } catch (recordError: any) {
        errors.push(`Record processing error: ${recordError.message}`);
        skipped.push(record);
      }
    }

    // Log the import
    const importLog = await prisma.appleHealthImportLog.create({
      data: {
        userId,
        recordsProcessed: weightRecords.length,
        recordsImported: imported.length,
        recordsSkipped: skipped.length,
        sourceFile: 'apple_health_export.xml',
        errors: JSON.stringify(errors),
      },
    });

    return NextResponse.json({
      success: true,
      imported: imported.length,
      skipped: skipped.length,
      duplicates: duplicates.length,
      errors,
      logId: importLog.id,
    });
  } catch (error: any) {
    console.error('[apple-health-import] Error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tracker/import-apple-health
 * Get import history for current user
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const logs = await prisma.appleHealthImportLog.findMany({
      where: { userId },
      orderBy: { importedAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({
      logs,
    });
  } catch (error: any) {
    console.error('[apple-health-import] GET Error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
