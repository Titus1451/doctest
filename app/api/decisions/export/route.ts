import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const decisions = await db.decision.findMany({
      include: {
        author: true,
        evidence: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Define CSV headers
    const headers = [
      'ID',
      'Title',
      'Summary',
      'Status',
      'Tax Type',
      'Jurisdictions',
      'Author',
      'Created Date',
      'Updated Date',
      'External Links'
    ];

    // Convert data to CSV rows
    const csvRows = decisions.map(decision => {
      // Format helper for safe CSV strings (escape quotes)
      const safe = (str: string | null | undefined) => {
        if (!str) return '';
        return `"${str.replace(/"/g, '""')}"`; // internal quotes escaped as ""
      };

      const jurisdictions = decision.jurisdictionCodes || '';
      const links = decision.evidence
        .filter(e => e.fileType === 'LINK')
        .map(e => e.fileUrl)
        .join('; ');

      return [
        safe(decision.id),
        safe(decision.title),
        safe(decision.summary),
        safe(decision.status),
        safe(decision.taxType),
        safe(jurisdictions),
        safe(decision.author?.name || 'Unknown'),
        safe(decision.createdAt.toISOString()),
        safe(decision.updatedAt.toISOString()),
        safe(links)
      ].join(',');
    });

    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // Return response with CSV headers
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="tax_decisions_export.csv"',
      },
    });

  } catch (error) {
    console.error('Export failed:', error);
    return new NextResponse('Export failed', { status: 500 });
  }
}
