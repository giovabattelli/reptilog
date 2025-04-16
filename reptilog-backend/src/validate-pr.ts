/**
 * Verify the PR is merged and merged into a production branch
 * @param pull_request 
 * @returns boolean indicating if PR is valid for processing
 */
export function verify_pr(pull_request: any, baseBranch: any): boolean {
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