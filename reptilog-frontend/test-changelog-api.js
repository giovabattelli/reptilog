const API_URL = 'http://localhost:3001/api/write-changelog';
const API_KEY = process.env.REPTILOG_API_KEY;

async function sendTestChangelog() {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                changelog: {
                    date: new Date().toISOString(),
                    title: "Test Changelog Entry",
                    md_description: "This is a test changelog entry created by the test script.\n\n- Item 1\n- Item 2\n\nThank you for testing!"
                },
                // Random PR number
                prNumber: Math.floor(Math.random() * 100) + 1
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Successfully created changelog entry:');
            console.log(JSON.stringify(data, null, 2));
        } else {
            console.error('Failed to create changelog entry:');
            console.error(data);
        }
    } catch (error) {
        console.error('Error sending request:', error);
    }
}

// POST to endpoint
sendTestChangelog(); 