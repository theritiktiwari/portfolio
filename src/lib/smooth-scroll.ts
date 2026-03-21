const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function smoothScrollTo(sectionId: string, duration = 800) {
	const element = document.getElementById(sectionId);
	if (!element) return;

	const targetY = element.getBoundingClientRect().top + window.scrollY;
	const startY = window.scrollY;
	const distance = targetY - startY;
	let startTime: number | null = null;

	const step = (timestamp: number) => {
		if (startTime === null) startTime = timestamp;
		const progress = Math.min((timestamp - startTime) / duration, 1);
		window.scrollTo(0, startY + distance * easeInOutCubic(progress));
		if (progress < 1) requestAnimationFrame(step);
	};

	requestAnimationFrame(step);
}
