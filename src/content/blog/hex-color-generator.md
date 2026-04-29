---
title: "Build a Hex Color Generator Using HTML, CSS and JavaScript"
description: "Learn how to create a simple hex color generator and live preview tool using vanilla HTML, CSS and JavaScript."
pubDate: 2021-07-20T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../assets/blog/hex-color-generator.avif
tags: ["html", "css", "javascript", "color-picker", "frontend", "portfolio"]
featured: false
draft: false
---

Interactive mini-projects are excellent portfolio pieces, and a Hex Color Generator is a great beginner-friendly JavaScript project.

In this tutorial, we'll build a live hex-code background generator using HTML, CSS and JavaScript.

## What We Are Building

Features:

- Enter any hex code
- Instantly preview background color
- Live input event handling
- Minimal JavaScript project for beginners

Great for:

- JavaScript practice
- Portfolio mini-projects
- UI utility tools
- Beginner coding projects

## HTML Code

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Hex Color Generator</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body>
		<div id="container">
			<input type="text" id="clr" value="#FFFFFF" />
		</div>
		<script src="main.js"></script>
	</body>
</html>
```

## CSS Code

```css
/* style.css */
* {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
	outline: none;
}
body {
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
}
#container {
	width: 30%;
	height: 30%;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0px 20px 30px rgba(75, 75, 75, 0.2);
	border-radius: 15px;
}
```

## JavaScript Code

```javascript
// main.js
let clr = document.getElementById("clr");
clr.addEventListener("input", function () {
	document.getElementById("container").style.background = clr.value;
});
```

## Video Tutorial

<div class="aspect-video w-full overflow-hidden rounded-xl shadow-lg">
  <iframe
    class="h-full w-full"
    src="https://www.youtube.com/embed/VhOAiFaO8A0?si=l5-aYaniUzrEz9Fe"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>
