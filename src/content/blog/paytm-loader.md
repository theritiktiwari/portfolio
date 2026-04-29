---
title: "Create a PayTM Loading Animation Using HTML & CSS"
description: "Learn how to recreate a PayTM-style loading animation using pure HTML and CSS with a live demo and step-by-step explanation."
pubDate: 2020-09-13T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../assets/blog/paytm-loader.avif
tags: ["html", "css", "loader", "animation", "frontend", "portfolio"]
featured: false
draft: false
---

Micro animations can make interfaces feel polished and engaging. In this tutorial, we'll recreate a PayTM-style loading animation using only HTML and CSS.

This is a great project for beginners and also a neat UI animation to showcase in your frontend portfolio.

## What We Are Building

We'll create:

- Animated circular dots
- Scale pulse effect
- Staggered animation delays
- Dual-tone PayTM-inspired colors

Perfect for:

- Loading screens
- Buttons with loading states
- App splash screens
- Portfolio animation demos

## HTML Code

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="stylesheet" href="style.css" />
		<title>Paytm Loading</title>
	</head>
	<body>
		<div class="wrap">
			<div class="one"></div>
			<div class="two"></div>
			<div class="three"></div>
			<div class="four"></div>
			<div class="five"></div>
		</div>
	</body>
</html>
```

## CSS Code

```css
/* style.css */
body {
	margin: 0;
	padding: 0;
	height: 100vh;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.wrap {
	height: 150px;
	width: 150px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.one,
.two,
.three,
.four,
.five {
	border-radius: 100%;
	margin: 1vw;
	animation: animate 1s infinite alternate;
}

@keyframes animate {
	0% {
		transform: scale(1);
	}

	100% {
		transform: scale(1.2);
	}
}

.one {
	animation-delay: 0.2s;
	border: 10px solid #00f;
}
.two {
	animation-delay: 0.4s;
	border: 10px solid #00f;
}
.three {
	animation-delay: 0.6s;
	border: 10px solid #00f;
}
.four {
	animation-delay: 0.8s;
	border: 10px solid #0ff;
}
.five {
	animation-delay: 1s;
	border: 10px solid #0ff;
}
```

## Video Tutorial

<div class="aspect-video w-full overflow-hidden rounded-xl shadow-lg">
  <iframe
    class="h-full w-full"
    src="https://www.youtube.com/embed/mlOkGUKwpAw?si=6vNuf4DP7riuPkq6"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>
