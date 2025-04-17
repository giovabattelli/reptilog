import { PullRequest } from "./types/interfaces.js";

/**
 * Build the prompt for the OpenAI LLM
 * @param pullRequest
 * @returns [systemPrompt, userPrompt] Two strings, system prompt and user prompt
 */
export function buildPrompt(pullRequest: PullRequest): [string, string] {
  const systemPrompt = `You are a changelog generator. You will be given a pull request with its commits and file changes, and your task is to generate a concise, customer-facing changelog entry. You are writing in the perspective of the team that made the changes.

  Make sure to include a good amount of details in the description. That includes, implications for users, cost implications, etc.
  For example, a good changelog title and descriptionfor a small PR would look like this:

<title example>
  Added system-wide dark mode support
</title>

<description example>
  We've added system-wide dark mode support to improve user experience in low-light environments.

- Implemented automatic theme detection based on system preferences
- Created new dark color palette that maintains WCAG AA contrast ratios
- Added smooth transitions between light and dark modes
- Fixed several UI inconsistencies in navigation components

This completes the dark mode implementation requested in issue #42.
</end example>

  Your response MUST be valid JSON with exactly these fields:
  {
    "title": "A short, one-line title summarizing the main change or feature (50 chars max)",
    "description": "A markdown-formatted description explaining what changed and why it matters to users (250 chars max)"
  }
  
  Guidelines:
  - Focus on user-facing changes, not implementation details
  - Use active voice and present tense
  - For bug fixes, explain what was fixed, not how
  - For features, explain the benefit, not the technical implementation
  - Be concise but informative
  - Prioritize information users care about
  - Make sure you're simplifying concepts and prioritizing user-friendliness
  - DO NOT make up any information. That includes (for example) the following: making up non-obvious user experience improvements (DON'T DO THIS!)
  - Base everything you say off of ACTUAL changes within PR information given to you (PR title, commits (including commit information such as message, diff, etc.), etc.)`;

  const userPrompt = `Please generate a changelog entry for this pull request:
  
  ${JSON.stringify(pullRequest, null, 2)}
  
  Remember to return only valid JSON with the title and description fields.`;

  return [systemPrompt, userPrompt];
}