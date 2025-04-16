import { Probot } from "probot";
import { Changelog } from "./types/interfaces.js";
import { send_pr_to_openai } from "./api/openai.js";
import { send_changelog_to_frontend } from "./api/frontend-interaction.js";
import { build_prompt } from "./prompt-builder.js";
import { construct_objects } from "./object-construction.js";
import { verify_pr } from "./validate-pr.js";

//import fs from "fs";

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
  const [systemPrompt, userPrompt] = build_prompt(pullRequest);
  const changelog: Changelog = await send_pr_to_openai(userPrompt, systemPrompt, pullRequest);

  // Send the changelog to the frontend
  await send_changelog_to_frontend(changelog, pull_request.number);

  // For debugging - save the data
  // fs.writeFileSync(
  //   `pr-${pullRequest.number}.json`,
  //   JSON.stringify(pullRequest, null, 2)
  // );

}