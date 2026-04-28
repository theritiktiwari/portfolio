"use client";

import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

function getAppliedTheme(): Theme {
	if (typeof window === "undefined") return "dark";
	return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function useTheme() {
	const [resolvedTheme, setResolvedTheme] = useState<Theme>(getAppliedTheme);

	const setTheme = useCallback((newTheme: Theme) => {
		const root = document.documentElement;
		root.classList.remove("dark", "light");
		root.classList.add(newTheme);
		localStorage.setItem("theme", newTheme);
		setResolvedTheme(newTheme);
	}, []);

	useEffect(() => {
		setResolvedTheme(getAppliedTheme());
	}, []);

	return { resolvedTheme, setTheme };
}
