import { Commit } from "./types/interfaces.js";
import { PullRequest } from "./types/interfaces.js";

/**
 * Construct the data objects
 * @param pull_request The pull request
 * @returns PullRequest Object storing specific PR information
 */
export async function constructObjects(context: any, pull_request: any): Promise<PullRequest> {

    // Get the commits href for this PR
    const commitsResponse = await context.octokit.request(pull_request._links.commits.href)

    // Array to store commits associated with this PR
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
            patch: file.patch // Literal diff in string format
        }));

        // Create + add commit object to commits array
        commits.push({
            message: detailedCommit.commit.message,
            date: detailedCommit.commit.author.date,
            files: processedFiles
        });
    }

    // Create the PR object with Commit[] array
    const pr = context.payload.pull_request;
    const pullRequest: PullRequest = {
        number: pr.number,
        title: pr.title,
        mergedAt: pr.merged_at || "",
        commits: commits
    };

    return pullRequest;

}