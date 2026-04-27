import { cn } from "@/lib/utils";

interface TagListProps {
	items: string[];
	label?: string;
	/** Extra classes on the `<ul>`. Defaults to `mt-2 flex flex-wrap` */
	className?: string;
	/** Extra classes on each `<li>`. Defaults to `mt-2 mr-1.5` */
	itemClassName?: string;
}

export function TagList({ items, label, className, itemClassName }: TagListProps) {
	if (!items.length) return null;
	return (
		<ul className={cn("flex flex-wrap", className)} aria-label={label}>
			{items.map((item) => (
				<li key={item} className={cn(itemClassName)}>
					<div className="bg-primary/20 text-ring flex items-center rounded-full px-3 py-1 text-xs leading-5 font-medium">
						{item}
					</div>
				</li>
			))}
		</ul>
	);
}
