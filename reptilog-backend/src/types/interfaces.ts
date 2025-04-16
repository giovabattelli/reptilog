/**
 * File change in a commit
 */
export interface FileChange {
    filename: string;
    status: string; // "added", "modified", "removed"
    additions: number;
    deletions: number;
    changes: number;
    patch?: string; // The literal diff patch with text changes
}

/**
 * Commit information
 */
export interface Commit {
    message: string;
    date: string;
    files: FileChange[];
}

/**
 * Pull request with its commits
 */
export interface PullRequest {
    number: number;
    title: string;
    mergedAt: string;
    commits: Commit[];
}

/**
 * Changelog entry
 */
export interface Changelog {
    date: string;
    title: string;
    md_description: string;
} 