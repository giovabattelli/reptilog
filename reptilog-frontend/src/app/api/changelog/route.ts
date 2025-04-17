import { NextRequest, NextResponse } from 'next/server';
import { getChangelogs, initDb } from '@/lib/db';

// Initialize the database
initDb().catch(console.error);

export async function GET(request: NextRequest) {
    try {
        // Get page and perPage from query parameters
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1', 10);
        const perPage = parseInt(searchParams.get('perPage') || '10', 10);

        // Get paginated changelogs
        const result = await getChangelogs(page, perPage);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error retrieving changelogs:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
