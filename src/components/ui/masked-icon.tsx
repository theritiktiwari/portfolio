import { cn } from "@/lib/utils";
import React from "react";

function getMaskStyles(src: string, maskSize: string): React.CSSProperties {
	return {
		WebkitMaskImage: `url(${src})`,
		maskImage: `url(${src})`,
		WebkitMaskRepeat: "no-repeat",
		maskRepeat: "no-repeat",
		WebkitMaskPosition: "center",
		maskPosition: "center",
		WebkitMaskSize: maskSize,
		maskSize: maskSize,
	};
}

interface MaskedIconProps {
	src: string;
	maskSize: string;
	className?: string;
}

export function MaskedIcon({ src, maskSize, className }: MaskedIconProps) {
	return (
		<span
			aria-hidden="true"
			className={cn("block bg-current transition-colors", className)}
			style={getMaskStyles(src, maskSize)}
		/>
	);
}
