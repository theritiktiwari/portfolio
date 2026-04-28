"use client";

import { BlogCard, type BlogCardProps } from "@/components/blog-card";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { cn, getURLParam, setURLParams } from "@/lib/utils";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

const POSTS_PER_PAGE = 6;

interface BlogPostsProps {
	posts: BlogCardProps[];
	featuredPosts: BlogCardProps[];
}

export function BlogPosts({ posts, featuredPosts }: BlogPostsProps) {
	const isInitialMount = useRef(true);

	const [query, setQuery] = useState(() => getURLParam("q") ?? "");
	const [currentPage, setCurrentPage] = useState(() => {
		const p = parseInt(getURLParam("page") ?? "1", 10);
		return isNaN(p) || p < 1 ? 1 : p;
	});

	useEffect(() => {
		const handler = (e: Event) => {
			setQuery((e as CustomEvent<{ query: string }>).detail.query);
		};
		window.addEventListener("blog-search", handler);
		return () => window.removeEventListener("blog-search", handler);
	}, []);

	const deferredQuery = useDeferredValue(query);
	const isSearching = deferredQuery.trim().length > 0;

	const filtered = useMemo(() => {
		return posts.filter((post) => {
			const q = deferredQuery.toLowerCase().trim();
			return (
				!q ||
				post.title.toLowerCase().includes(q) ||
				post.description.toLowerCase().includes(q) ||
				post.tags.some((t) => t.includes(q))
			);
		});
	}, [posts, deferredQuery]);

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}
		setCurrentPage(1);
		setURLParams({ page: null });
	}, [deferredQuery]);

	const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
	const safePage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

	useEffect(() => {
		if (totalPages > 0 && currentPage !== safePage) {
			setCurrentPage(safePage);
			setURLParams({ page: safePage > 1 ? String(safePage) : null });
		}
	}, [currentPage, safePage, totalPages]);

	const paginatedPosts = filtered.slice(
		(safePage - 1) * POSTS_PER_PAGE,
		safePage * POSTS_PER_PAGE
	);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		setURLParams({ page: page > 1 ? String(page) : null });
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const getVisiblePages = () => {
		const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
		if (totalPages <= 5) return pages;
		if (safePage <= 3) return [...pages.slice(0, 4), -1, totalPages];
		if (safePage >= totalPages - 2) return [1, -1, ...pages.slice(totalPages - 4)];
		return [1, -1, safePage - 1, safePage, safePage + 1, -1, totalPages];
	};

	return (
		<div className="space-y-16">
			{!isSearching && featuredPosts.length > 0 && (
				<div>
					<p className="text-muted-foreground mb-4 text-xs font-semibold tracking-widest uppercase">
						Featured
					</p>
					<div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-6">
						{featuredPosts.map((post) => (
							<BlogCard key={post.id} {...post} featuredPost />
						))}
					</div>
				</div>
			)}

			<div>
				<p className="text-muted-foreground mb-6 text-xs font-semibold tracking-widest uppercase">
					{isSearching ? "Search results" : "All posts"}
				</p>

				{filtered.length === 0 ? (
					<p className="text-muted-foreground py-12 text-center">
						No posts match your search.
					</p>
				) : (
					<div className="space-y-6">
						<div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-4">
							{paginatedPosts.map((post) => (
								<BlogCard key={post.id} {...post} />
							))}
						</div>

						<div className="flex items-center justify-between">
							<p className="text-muted-foreground text-sm">
								{filtered.length} {filtered.length === 1 ? "post" : "posts"}
								{totalPages > 1 && ` — Page ${safePage} of ${totalPages}`}
							</p>

							{totalPages > 1 && (
								<Pagination className="mx-0 w-auto justify-end">
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious
												onClick={(e) => {
													e.preventDefault();
													if (safePage > 1)
														handlePageChange(safePage - 1);
												}}
												aria-disabled={safePage === 1}
												className={cn({
													"pointer-events-none opacity-50":
														safePage === 1,
												})}
											/>
										</PaginationItem>

										{getVisiblePages().map((page, idx) =>
											page === -1 ? (
												<PaginationItem key={`e-${idx}`}>
													<PaginationEllipsis />
												</PaginationItem>
											) : (
												<PaginationItem key={page}>
													<PaginationLink
														isActive={page === safePage}
														onClick={(e) => {
															e.preventDefault();
															handlePageChange(page);
														}}
													>
														{page}
													</PaginationLink>
												</PaginationItem>
											)
										)}

										<PaginationItem>
											<PaginationNext
												onClick={(e) => {
													e.preventDefault();
													if (safePage < totalPages)
														handlePageChange(safePage + 1);
												}}
												aria-disabled={safePage === totalPages}
												className={cn({
													"pointer-events-none opacity-50":
														safePage === totalPages,
												})}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
