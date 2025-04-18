import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Define a type for the code component props
interface CustomCodeProps {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
}

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
    return (
        <div className={`markdown-content prose prose-sm dark:prose-invert max-w-none ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // heading styles
                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />,

                    // list styling (bullet points)
                    ul: ({ node, ...props }) => <ul className="pl-6 mb-4 list-disc" {...props} />,
                    ol: ({ node, ...props }) => <ol className="pl-6 mb-4 list-decimal" {...props} />,
                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,

                    // paragraph spacing
                    p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,

                    // style links
                    a: ({ node, ...props }) => <a className="text-blue-600 hover:text-blue-800 underline" {...props} />,

                    // code blocks/inline code
                    code: ({ inline, className, children, ...props }: CustomCodeProps) =>
                        inline
                            ? <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono" {...props}>{children}</code>
                            : <code className="block p-4 my-4 overflow-x-auto bg-gray-100 dark:bg-gray-800 rounded-md font-mono text-sm" {...props}>{children}</code>,

                    // emphasis improvements
                    em: ({ node, ...props }) => <em className="italic" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
} 