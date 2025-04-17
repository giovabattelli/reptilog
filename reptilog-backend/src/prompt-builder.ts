import { PullRequest } from "./types/interfaces.js";

/**
 * Build the prompt for the OpenAI LLM
 * @param pullRequest
 * @returns [systemPrompt, userPrompt] Two strings, system prompt and user prompt
 */
export function buildPrompt(pullRequest: PullRequest): [string, string] {
  const systemPrompt = `You are a changelog generator. You will be given a pull request with its commits and file changes, and your task is to generate a concise, customer-facing changelog entry. You are writing in the perspective of the team that made the changes.
  
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