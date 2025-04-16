import { Probot } from "probot";
import { OpenAI } from "openai";
import { Commit, PullRequest, Changelog } from "./types/interfaces.js";
import fetch from "node-fetch";
import fs from "fs";

/**
 * Entry point
 * @param app
 * @returns void
 */
export default (app: Probot) => {

  // Activate when a PR closes
  app.on("pull_request.closed", async (context) => {

    try {
      await process_pr(context);
    } catch (error) {
      console.error(`Error processing PR #${context.payload.pull_request.number}: ${error}`);
    }

  });
};

/**
 * Process the PR
 * @param context
 * @returns void
 */
async function process_pr(context: any) {

  const pull_request = context.payload.pull_request;
  const baseBranch = pull_request.base.ref;

  // make sure the PR is valid
  if (!verify_pr(pull_request, baseBranch)) {
    return; // Skip invalid PRs
  }

  console.log(`Processing merged PR #${pull_request.number} to main branch: ${baseBranch}`);

  const pullRequest = await construct_objects(context, pull_request);
  const changelog: Changelog = await send_pr_to_openai(pullRequest);

  // Send the changelog to the frontend
  await send_changelog_to_frontend(changelog, pull_request.number);

  // For debugging - save the data
  // fs.writeFileSync(
  //   `pr-${pullRequest.number}.json`,
  //   JSON.stringify(pullRequest, null, 2)
  // );

}

/**
 * Verify the PR is merged and merged into a production branch
 * @param pull_request 
 * @returns boolean indicating if PR is valid for processing
 */
function verify_pr(pull_request: any, baseBranch: any): boolean {
  const mainBranchNames = ['main', 'master'];

  // filter out PRs that are not merged
  if (!pull_request.merged) {
    console.log(`PR #${pull_request.number} was closed without merging. Skipping.`);
    return false;
  }

  // Check if this PR was merged into production branch, if not, don't process PR
  if (!mainBranchNames.includes(baseBranch.toLowerCase())) {
    console.log(`PR #${pull_request.number} was merged to ${baseBranch}, not to production branch. Skipping.`);
    return false;
  }

  return true;
}

/**
 * Construct the data objects
 * @param pull_request The pull request
 * @returns PullRequest
 */
async function construct_objects(context: any, pull_request: any): Promise<PullRequest> {

  // Get the commits for this PR (request commits from PR commits href)
  const commitsResponse = await context.octokit.request(pull_request._links.commits.href)

  const commits: Commit[] = [];

  for (const commitData of commitsResponse.data) {
    // Get detailed commit info with file changes
    const detailedCommitResponse = await context.octokit.request(
      'GET /repos/{owner}/{repo}/commits/{commit_sha}',
      {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        commit_sha: commitData.sha
      }
    );

    const detailedCommit = detailedCommitResponse.data;

    // Process files to include the patch
    const processedFiles = (detailedCommit.files || []).map((file: any) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      patch: file.patch // Contains literal diff for changes to a file
    }));

    // Create + add commit object to commits array
    commits.push({
      message: detailedCommit.commit.message,
      date: detailedCommit.commit.author.date,
      files: processedFiles
    });
  }

  // Create the PR object with commits
  const pr = context.payload.pull_request;
  const pullRequest: PullRequest = {
    number: pr.number,
    title: pr.title,
    mergedAt: pr.merged_at || "",
    commits: commits
  };

  return pullRequest;

}

/**
 * Send the PR to OpenAI for the creation of a changelog
 * @param pullRequest
 * @returns Changelog
 */
async function send_pr_to_openai(pullRequest: PullRequest): Promise<Changelog> {
  const [systemPrompt, userPrompt] = build_prompt(pullRequest);

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

/**
 * Build the prompt for the OpenAI API
 * @param pullRequest
 * @returns [systemPrompt, userPrompt]
 */
function build_prompt(pullRequest: PullRequest): [string, string] {
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
- Make sure you're simplifying concepts and prioritizing user-friendliness`;

  const userPrompt = `Please generate a changelog entry for this pull request:

${JSON.stringify(pullRequest, null, 2)}

Remember to return only valid JSON with the title and description fields.`;

  // fs.writeFileSync("userPrompt.txt", userPrompt);
  // fs.writeFileSync("systemPrompt.txt", systemPrompt);

  return [systemPrompt, userPrompt];
}

/**
 * Sends the generated changelog to the frontend
 * @param changelog The generated changelog
 * @param prNumber The PR number for reference
 * @returns Promise<void>
 */
async function send_changelog_to_frontend(changelog: Changelog, prNumber: number): Promise<void> {
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
    fs.writeFileSync(
      `payload-pr-${prNumber}.json`,
      JSON.stringify(payload, null, 2)
    );

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
