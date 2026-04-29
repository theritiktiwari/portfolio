---
title: "Build a BMI Calculator Using HTML, CSS and JavaScript"
description: "Learn how to build a beginner-friendly BMI Calculator using HTML, CSS and vanilla JavaScript."
pubDate: 2021-07-26T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../assets/blog/bmi-calculator.avif
tags: ["html", "css", "javascript", "bmi-calculator", "frontend", "portfolio"]
featured: false
draft: false
---

Mini JavaScript projects are one of the best ways to strengthen core frontend skills. In this tutorial, we'll build a BMI Calculator using HTML, CSS and vanilla JavaScript.

This is a beginner-level project that teaches:

- DOM manipulation
- Form handling
- Input validation
- Conditional logic
- Real-world calculations

## What We Are Building

Features:

- Enter height and weight
- Calculate Body Mass Index (BMI)
- Show weight classification
- Handle invalid input
- Beginner-friendly JavaScript logic

Great for:

- JavaScript practice
- Beginner portfolios
- Health-related utility tools
- DOM manipulation exercises

## HTML Code

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="stylesheet" href="style.css" />
		<title>BMI Calculator</title>
	</head>
	<body>
		<div class="container">
			<h2>BMI Calculator</h2>
			<form class="form">
				<input
					type="text"
					class="input"
					name="height"
					id="height"
					placeholder="Enter Height..."
				/>
				<input
					type="text"
					class="input"
					name="weight"
					id="weight"
					placeholder="Enter Weight..."
				/>
				<button type="submit" class="btn">Calculate</button>
				<div id="result"></div>
			</form>
		</div>
		<script src="script.js"></script>
	</body>
</html>
```

## CSS Code

```css
/* style.css */
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-size: 1rem;
	font-family: "Montserrat", sans-serif;
}

body {
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
}

.container {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 30%;
	height: 50%;
	border-radius: 15px;
	box-shadow:
		28px 28px 74px #d6d6d6,
		-28px -28px 74px #ffffff;
}

h2 {
	font-size: 2rem;
}

.container .form {
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	flex-direction: column;
	width: 80%;
	height: 70%;
}

.input {
	padding: 12px 24px;
	margin: 12px 24px;
	width: 90%;
	border-radius: 5px;
	outline: none;
	border: none;
	box-shadow:
		5px 5px 10px #d6d6d6,
		-5px -5px 10px #ffffff;
	transition: all 0.6s ease-in-out;
}
.input:focus {
	box-shadow:
		inset 5px 5px 10px #d6d6d6,
		inset -5px -5px 10px #ffffff;
}

.btn {
	padding: 15px 30px;
	font-size: 1rem;
	border-radius: 5px;
	background-color: #8700c3;
	color: #fff;
	border: none;
	cursor: pointer;
	transition: all 0.6s ease-in-out;
}
.btn:hover {
	background-color: rgba(135, 0, 195, 0.8);
}

#result {
	display: none;
	padding: 12px 24px;
	margin: 12px 24px;
	width: 90%;
	border-radius: 5px;
	text-align: center;
	box-shadow:
		inset 28px 28px 74px #d6d6d6,
		inset -28px -28px 74px #ffffff;
}
```

## JavaScript Code

```javascript
// script.js
let form = document.querySelector("form");

form.addEventListener("submit", function (e) {
	e.preventDefault();
	let height = parseInt(document.getElementById("height").value);
	let weight = parseInt(document.getElementById("weight").value);
	let result = document.getElementById("result");

	result.style.display = "block";

	if (height === "" || height < 0 || isNaN(height)) {
		result.innerHTML = `${height} is Invalid Height <br/> Please provide valid Height`;
	} else if (weight === "" || weight < 0 || isNaN(weight)) {
		result.innerHTML = `${weight} is Invalid Weight <br/> Please provide valid Weight`;
	} else {
		let bmi = (weight / ((height * height) / 10000)).toFixed(2);
		if (bmi < 18.6) {
			result.innerHTML = `BMI = ${bmi} <br/> This is Under Weight`;
		} else if (bmi > 24.9) {
			result.innerHTML = `BMI = ${bmi} <br/> This is Over Weight`;
		} else if (bmi > 18.6 && bmi < 24.9) {
			result.innerHTML = `BMI = ${bmi} <br/> This is Normal Weight`;
		}
	}
});
```

## BMI Classification

This project classifies users as:

| BMI Range  | Category      |
| ---------- | ------------- |
| Below 18.6 | Underweight   |
| 18.6–24.9  | Normal Weight |
| Above 24.9 | Overweight    |

## Video Tutorial

<div class="aspect-video w-full overflow-hidden rounded-xl shadow-lg">
  <iframe
    class="h-full w-full"
    src="https://www.youtube.com/embed/t-5rrmib0Lo?si=bZkH6gYZz_6vVp0E"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>
