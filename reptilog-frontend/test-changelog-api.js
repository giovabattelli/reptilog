// Simple test script to simulate POST requests to the changelog API
// You can run this with Node.js: node test-changelog-api.js

// Before running this, make sure your Next.js app is running
// You might need to adjust the API_KEY to match the one in your application

const API_URL = 'http://localhost:3001/api/write-changelog';
const API_KEY = 'default-secret-key'; // Must match the key in api/changelog/route.ts

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
                prNumber: Math.floor(Math.random() * 100) + 1 // Random PR number for testing
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

// Execute the test
sendTestChangelog(); 