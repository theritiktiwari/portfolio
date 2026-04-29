---
title: "Build Animated Social Media Icons Using HTML and CSS"
description: "Learn how to create animated social media icons with hover effects using pure HTML and CSS."
pubDate: 2020-09-19T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../assets/blog/social-media-icons.avif
tags: ["html", "css", "animations", "social-icons", "frontend", "portfolio"]
featured: false
draft: false
---

Animated UI elements can make even simple websites feel interactive and polished. In this tutorial, we'll build animated social media icons using only HTML and CSS.

This is a great mini-project to showcase in your portfolio or reuse in landing pages, personal websites, or footer sections.

## What We Are Building

Features:

- Circular social media buttons
- Hover animations
- Icon scaling effects
- Rotation interaction
- Pure CSS micro-interactions

Great for:

- Portfolio websites
- Landing page footers
- Profile cards
- Personal websites

## HTML Code

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="stylesheet" href="style.css" />
		<script src="https://kit.fontawesome.com/767a85f1ee.js" crossorigin="anonymous"></script>
		<title>Social Media Icons</title>
	</head>
	<body>
		<div class="wrap">
			<a href="https://www.facebook.com/theritiktiwari/" class="btn" target="_blank">
				<i class="fab fa-facebook"></i>
			</a>
			<a href="https://www.instagram.com/theritiktiwari/" class="btn" target="_blank">
				<i class="fab fa-instagram"></i>
			</a>
			<a href="https://twitter.com/theritiktiwari" class="btn" target="_blank">
				<i class="fab fa-twitter"></i>
			</a>
			<a
				href="https://www.youtube.com/channel/UCaTiS60yVc1MJods9sFFtuw"
				class="btn"
				target="_blank"
			>
				<i class="fab fa-youtube"></i>
			</a>
			<a href="https://www.linkedin.com/in/theritiktiwari/" class="btn" target="_blank">
				<i class="fab fa-linkedin"></i>
			</a>
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
	background-color: #3a3a5d;
}

.wrap {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	width: 100%;
	text-align: center;
}

.btn {
	display: inline-block;
	width: 90px;
	height: 90px;
	background-color: #f1f1f1;
	margin: 10px;
	color: #3498db;
	box-shadow: 0px 5px 15px -5px #000;
	border-radius: 50%;
}

.btn i {
	font-size: 36px;
	line-height: 90px;
}

.btn i:hover {
	transform: scale(1.3);
	color: #fff;
}

.btn:hover {
	background-color: #3498db;
	animation: animate 1s;
}

@keyframes animate {
	0% {
		transform: rotate(180deg);
	}
}
```

## Video Tutorial

<div class="aspect-video w-full overflow-hidden rounded-xl shadow-lg">
  <iframe
    class="h-full w-full"
    src="https://www.youtube.com/embed/7_Nilem5u-c?si=l4TtXj5bEZA7VFwE"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>
