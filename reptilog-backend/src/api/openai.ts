import { Changelog } from "../types/interfaces.js";
import OpenAI from "openai";
import { PullRequest } from "../types/interfaces.js";

/**
 * Send the PR to OpenAI for the creation of a changelog
 * @param pullRequest
 * @returns Changelog
 */
export async function sendPrToOpenAI(userPrompt: string, systemPrompt: string, pullRequest: PullRequest): Promise<Changelog> {

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" }, // Request JSON response
        temperature: 0.4,
    });

    const response = completion.choices[0].message.content;

    try {
        // Parse the JSON response
        const parsedResponse = JSON.parse(response || "{}");

        const changelog: Changelog = {
            date: pullRequest.mergedAt,
            title: parsedResponse.title || "No title provided",
            md_description: parsedResponse.description || "No description provided"
        };

        return changelog;
    } catch (error) {
        console.error("Error parsing OpenAI response:", error);
        // Fallback if JSON parsing fails
        return {
            date: pullRequest.mergedAt,
            title: "Error parsing response",
            md_description: response || "No response from OpenAI"
        };
    }
}