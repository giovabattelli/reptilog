'use client';

import { useEffect, useState } from 'react';
import { BlurFade } from './magicui/blur-fade';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from './ui/pagination';
import { ChangelogEntry } from '@/lib/db';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ChangelogResponse = {
    changelogs: ChangelogEntry[];
    total: number;
    totalPages: number;
};

export default function Changelog() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ChangelogResponse | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [openEntries, setOpenEntries] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchChangelogs = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/changelog?page=${currentPage}&perPage=5`);

                if (!response.ok) {
                    throw new Error('Failed to fetch changelogs');
                }

                const data: ChangelogResponse = await response.json();
                setData(data);
                setError(null);
                // Reset open entries when page changes
                setOpenEntries({});
            } catch (err) {
                setError('Error loading changelogs');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchChangelogs();
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const toggleEntry = (id: string) => {
        setOpenEntries(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Generate pagination items
    const renderPaginationItems = () => {
        if (!data) return null;

        const items = [];
        const maxVisible = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(data.totalPages, startPage + maxVisible - 1);

        // Adjust if we're near the end
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        isActive={currentPage === i}
                        onClick={() => handlePageChange(i)}
                        className="cursor-pointer"
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-1 px-4">
            <BlurFade duration={0.5} delay={0.1}>
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-2">
                        <Image
                            src="/reptilog-icon.png"
                            alt="Reptilog Logo"
                            width={120}
                            height={120}
                            className="rounded-lg"
                        />
                    </div>
                    <h2 className="text-3xl font-bold">Changelog</h2>
                </div>
            </BlurFade>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : error ? (
                <div className="text-center text-red-500 py-10">{error}</div>
            ) : data && data.changelogs.length > 0 ? (
                <>
                    <div className="space-y-4">
                        {data.changelogs.map((entry, index) => (
                            <BlurFade key={entry.id} delay={0.1 + index * 0.05}>
                                <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                                    <button
                                        onClick={() => toggleEntry(entry.id)}
                                        className="w-full p-6 flex flex-col text-left hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-xl font-semibold pr-4">{entry.title}</h3>
                                            <ChevronDown
                                                className={`h-5 w-5 mt-1 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${openEntries[entry.id] ? 'rotate-180' : ''}`}
                                            />
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {formatDate(entry.date)}
                                        </span>
                                    </button>

                                    <AnimatePresence>
                                        {openEntries[entry.id] && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="border-t"
                                            >
                                                <div className="p-6">
                                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {entry.md_description}
                                                        </ReactMarkdown>
                                                    </div>
                                                    <div className="mt-4 text-sm text-muted-foreground">
                                                        Pull Request #{entry.prNumber}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </BlurFade>
                        ))}
                    </div>

                    {data.totalPages > 1 && (
                        <BlurFade delay={0.3}>
                            <Pagination className="mt-10">
                                <PaginationContent>
                                    {currentPage > 1 && (
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                className="cursor-pointer"
                                            />
                                        </PaginationItem>
                                    )}

                                    {renderPaginationItems()}

                                    {currentPage < data.totalPages && (
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                className="cursor-pointer"
                                            />
                                        </PaginationItem>
                                    )}
                                </PaginationContent>
                            </Pagination>
                        </BlurFade>
                    )}
                </>
            ) : (
                <BlurFade delay={0.2}>
                    <div className="text-center py-10 text-muted-foreground">
                        No changelog entries found.
                    </div>
                </BlurFade>
            )}
        </div>
    );
}