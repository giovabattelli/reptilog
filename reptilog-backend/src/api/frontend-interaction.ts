import { Changelog } from "../types/interfaces.js";

// import fs from "fs";

/**
 * Sends the generated changelog to the frontend
 * @param changelog The generated changelog
 * @param prNumber The PR number for reference
 * @returns Promise<void>
 */
export async function send_changelog_to_frontend(changelog: Changelog, prNumber: number): Promise<void> {
    // Get configuration from environment variables with fallbacks
    const frontendUrl = process.env.FRONTEND_URL;
    const endpoint = process.env.CHANGELOG_ENDPOINT;
    const apiKey = process.env.API_KEY;

    try {
        // Prepare the request payload
        const payload = {
            changelog,
            prNumber
        };

        // Write just the payload to a file
        // fs.writeFileSync(
        //     `payload-pr-${prNumber}.json`,
        //     JSON.stringify(payload, null, 2)
        // );

        console.log(`Payload written to: payload-pr-${prNumber}.json`);

        // Send the POST request with simple API key authorization
        const response = await fetch(`${frontendUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}` // Simple Bearer token authentication
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to send changelog to frontend: ${response.status} ${response.statusText} - ${errorText}`);
        }

        console.log(`Successfully sent changelog for PR #${prNumber} to frontend`);
    } catch (error) {
        console.error(`Error sending changelog to frontend: ${error}`);
        throw error;
    }
}