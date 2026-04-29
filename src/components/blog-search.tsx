"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getURLParam, setURLParams } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const DEBOUNCE_MS = 300;

export function BlogSearch() {
	const [open, setOpen] = useState(() => (getURLParam("q") ?? "").length > 0);
	const [value, setValue] = useState(() => getURLParam("q") ?? "");
	const inputRef = useRef<HTMLInputElement>(null);
	const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape" && open) close();
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open]);

	const emit = (q: string) => {
		window.dispatchEvent(new CustomEvent("blog-search", { detail: { query: q } }));
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const v = e.target.value;
		setValue(v);
		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			emit(v);
			setURLParams({ q: v || null, page: null });
		}, DEBOUNCE_MS);
	};

	const close = () => {
		const hadQuery = value.length > 0;
		setOpen(false);
		setValue("");
		clearTimeout(timerRef.current);
		emit("");
		if (hadQuery) {
			// Search was active — reset page since results changed
			setURLParams({ q: null, page: null });
		} else {
			// No query was typed — just close, preserve page
			setURLParams({ q: null });
		}
	};

	if (open) {
		return (
			<div className="flex items-center gap-2">
				<div className="relative">
					<Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
					<Input
						ref={inputRef}
						value={value}
						onChange={handleChange}
						placeholder="Search posts…"
						className="h-8 w-36 pl-7 sm:w-52"
					/>
				</div>
				<Button variant="ghost" size="icon-sm" onClick={close} aria-label="Close search">
					<X />
				</Button>
			</div>
		);
	}

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			onClick={() => setOpen(true)}
			aria-label="Search posts"
		>
			<Search className="size-3.5" />
		</Button>
	);
}
