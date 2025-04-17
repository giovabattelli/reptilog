import { NextRequest, NextResponse } from 'next/server';
import { addChangelog, initDb } from '@/lib/db';

// Static API key for basic authentication 
// (would implement a more secure auth technique if project was deployed)
const REPTILOG_API_KEY = process.env.REPTILOG_API_KEY;

// Initialize the database
initDb().catch(console.error);

export async function POST(request: NextRequest) {
    // Check for API key in headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== REPTILOG_API_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Parse the request body
        const body = await request.json();

        // Validate required fields
        if (!body.changelog || !body.prNumber) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create a changelog entry
        const entry = await addChangelog({
            date: body.changelog.date,
            title: body.changelog.title,
            md_description: body.changelog.md_description,
            prNumber: body.prNumber
        });

        return NextResponse.json({ success: true, entry }, { status: 201 });
    } catch (error) {
        console.error('Error saving changelog:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 