export default function Footer() {
	return (
		<footer className="text-muted-foreground max-w-md space-y-2 pb-5 text-sm sm:pb-0">
			<p>
				© {new Date().getFullYear()} Ritik Tiwari. Built with Next.js, Tailwind CSS &
				TypeScript.
			</p>
		</footer>
	);
}
