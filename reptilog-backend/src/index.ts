import { Probot } from "probot";
import { Changelog } from "./types/interfaces.js";
import { sendPrToOpenAI } from "./api/openai.js";
import { sendChangelogToFrontend } from "./api/frontend-interaction.js";
import { buildPrompt } from "./prompt-builder.js";
import { constructObjects } from "./object-construction.js";
import { verifyPr } from "./validate-pr.js";

/**
 * Entry point
 * @param app
 * @returns void
 */
export default (app: Probot) => {

  // Activate when a PR closes
  app.on("pull_request.closed", async (context) => {

    try {
      await processPr(context);
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
async function processPr(context: any) {

  const pull_request = context.payload.pull_request;
  const baseBranch = pull_request.base.ref;

  // make sure the PR is valid
  if (!verifyPr(pull_request, baseBranch)) {
    return; // Skip invalid PRs
  }

  console.log(`Processing merged PR #${pull_request.number} to main branch: ${baseBranch}`);

  const pullRequest = await constructObjects(context, pull_request);
  const [systemPrompt, userPrompt] = buildPrompt(pullRequest);
  const changelog: Changelog = await sendPrToOpenAI(userPrompt, systemPrompt, pullRequest);

  // Send the changelog to the frontend
  await sendChangelogToFrontend(changelog, pull_request.number);

}