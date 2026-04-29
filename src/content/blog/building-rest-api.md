---
title: "Building a REST API with Node.js, Express, MongoDB and JWT"
description: "Learn how to build a secure REST API using Express, MongoDB, JWT authentication, middleware, and Yarn package manager."
pubDate: 2023-03-20T00:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../assets/blog/building-rest-api.avif
tags: ["nodejs", "express", "mongodb", "jwt", "rest-api", "backend"]
featured: false
draft: false
---

Building a secure REST API is one of the core backend skills every developer should know. In this guide, we'll create a complete authentication API using **Node.js**, **Express**, **MongoDB**, **JWT**, and **yarn**.

## Step 1: Initialize the Project

Run:

```bash
yarn init
```

Configure your `package.json`:

```json
{
	"name": "rest-api",
	"version": "1.0.0",
	"description": "This is an example of REST API",
	"main": "index.js",
	"repository": "https://github.com/theritiktiwari/REST-API",
	"author": {
		"name": "Ritik Tiwari",
		"email": "contact@ritiktiwari.com",
		"url": "https://ritiktiwari.com"
	},
	"license": "MIT",
	"scripts": {
		"dev": "nodemon index.js",
		"start": "node index.js"
	}
}
```

---

## Step 2: Install Dependencies

Install required packages:

```bash
yarn add express express-validator cors crypto-js dotenv nodemon uuid mongoose jsonwebtoken
```

## Step 3: Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URI=mongodb://localhost:27017/rest-api
JWT_SECRET_KEY=[generate-a-secret-key]
CRYPTOJS_SECRET_KEY=[generate-a-secret-key]
PORT=5000
```

This keeps secrets out of source control.

## Step 4: Connect MongoDB

```javascript
// config/connectDB.js
const mongoose = require("mongoose");

const connectDB = () => {
	try {
		mongoose.connect(process.env.DATABASE_URI, (err) => {
			if (err) return console.log(err);

			console.log("Database Connected!");
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports = connectDB;
```

## Step 5: Create User Schema

```javascript
// model/users.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},

	email: {
		type: String,
		required: true,
		unique: true,
	},

	password: {
		type: String,
		required: true,
		minlength: 8,
	},

	role: {
		type: String,
		default: "user",
	},

	timestamp: {
		type: Date,
		default: Date.now,
	},
});

const User = mongoose.model("user", userSchema);

module.exports = User;
```

## Step 6: Create Authentication Middleware

```javascript
// middleware/fetchUser.js
const jwt = require("jsonwebtoken");

const fetchUser = (req, res, next) => {
	const token = req.header("auth-token");

	if (!token) {
		return res.status(401).json({
			type: "error",
			message: "Invalid Credentials.",
		});
	}

	try {
		const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

		req.user = data.user;

		next();
	} catch (error) {
		res.status(500).json({
			type: "error",
			message: "Something went wrong.",
		});
	}
};

module.exports = fetchUser;
```

This middleware protects restricted routes.

## Step 7: Create Authentication Routes

```javascript
// routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const { body, validationResult } = require("express-validator");

const User = require("../model/users");
const fetchUser = require("../middleware/fetchUser");

// ROUTE 1 — Create User
router.post(
	"/newuser",
	[
		body("name").isLength({ min: 3 }),
		body("email").isEmail(),
		body("password").isLength({ min: 8 }),
	],
	async (req, res) => {
		const error = validationResult(req);

		if (!error.isEmpty()) {
			return res.status(400).json({
				type: "error",
				message: error.array(),
			});
		}

		const { name, email, password, confirmPassword } = req.body;

		try {
			let existingUser = await User.findOne({ email });

			if (existingUser) {
				return res.status(409).json({
					type: "error",
					message: "Email already used.",
				});
			}

			if (password !== confirmPassword) {
				return res.status(400).json({
					type: "error",
					message: "Password does not match.",
				});
			}

			const user = await User.create({
				name,
				email,
				password: CryptoJS.AES.encrypt(
					password,
					process.env.CRYPTOJS_SECRET_KEY
				).toString(),
			});

			if (user.id) {
				res.status(200).json({
					type: "success",
					message: "Account created successfully.",
				});
			}
		} catch (err) {
			res.status(500).json({
				type: "error",
				message: "Something went wrong.",
			});
		}
	}
);

// ROUTE 2 — Login
router.post("/login", [body("email").isEmail(), body("password").exists()], async (req, res) => {
	const error = validationResult(req);

	if (!error.isEmpty()) {
		return res.status(400).json({
			type: "error",
			message: error.array(),
		});
	}

	const { email, password } = req.body;

	try {
		let user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				type: "error",
				message: "Invalid Credentials.",
			});
		}

		let pass = CryptoJS.AES.decrypt(user.password, process.env.CRYPTOJS_SECRET_KEY);

		let decryptedPassword = pass.toString(CryptoJS.enc.Utf8);

		if (password !== decryptedPassword) {
			return res.status(400).json({
				type: "error",
				message: "Invalid Credentials.",
			});
		}

		const user_data = {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		};

		const authToken = jwt.sign(user_data, process.env.JWT_SECRET_KEY);

		res.status(200).json({
			type: "success",
			message: "Logged in successfully",
			data: authToken,
		});
	} catch (err) {
		res.status(500).json({
			type: "error",
			message: "Something went wrong.",
		});
	}
});

// ROUTE 3 — Get Logged In User
router.post("/getuser", fetchUser, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");

		res.status(200).json({
			type: "success",
			data: user,
		});
	} catch (err) {
		res.status(500).json({
			type: "error",
			message: "Something went wrong.",
		});
	}
});

// ROUTE 4 — Get All Users
router.post("/users", fetchUser, async (req, res) => {
	try {
		if (req.user.role !== "admin") {
			return res.status(401).json({
				type: "error",
				message: "Unauthorized",
			});
		}

		const users = await User.find();

		res.status(200).json({
			type: "success",
			data: users,
		});
	} catch (err) {
		res.status(500).json({
			type: "error",
			message: "Something went wrong.",
		});
	}
});

// ROUTE 5 — Get User By ID
router.post("/user/:id", fetchUser, async (req, res) => {
	try {
		if (req.user.role !== "admin") {
			return res.status(401).json({
				type: "error",
				message: "Unauthorized",
			});
		}

		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).json({
				message: "User not found.",
			});
		}

		res.status(200).json({
			type: "success",
			data: user,
		});
	} catch (err) {
		res.status(500).json({
			type: "error",
			message: "Something went wrong.",
		});
	}
});

// ROUTE 6 — Update User
router.put("/update/:id", fetchUser, async (req, res) => {
	try {
		const { name, email, password, role } = req.body;

		const existingUser = await User.findById(req.params.id);

		if (!existingUser) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		const hashPass = password
			? CryptoJS.AES.encrypt(password, process.env.CRYPTOJS_SECRET_KEY).toString()
			: existingUser.password;

		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				name: name || existingUser.name,
				email: email || existingUser.email,
				password: hashPass,
				role: role || existingUser.role,
			},
			{ new: true }
		);

		res.status(200).json({
			type: "success",
			data: updatedUser,
		});
	} catch (err) {
		res.status(500).json({
			type: "error",
			message: "Something went wrong.",
		});
	}
});

// ROUTE 7 — Delete User
router.delete("/delete/:id", fetchUser, async (req, res) => {
	try {
		if (req.user.role !== "admin") {
			return res.status(401).json({
				message: "Unauthorized",
			});
		}

		await User.findByIdAndDelete(req.params.id);

		res.status(200).json({
			type: "success",
			message: "User deleted successfully",
		});
	} catch (err) {
		res.status(500).json({
			type: "error",
			message: "Something went wrong.",
		});
	}
});

module.exports = router;
```

---

## Step 8: Create Main Entry File

```javascript
// index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/connectDB");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

connectDB();

app.get("/", (req, res) => {
	res.send("REST API Example");
});

app.use("/api/auth", require("./routes/auth"));

app.listen(port, () => {
	console.log(`Server is running on port ${port}...`);
});

module.exports = app;
```

## Step 9: Run the Server

Start development server:

```bash
yarn dev
```

Production:

```bash
yarn start
```

## Project Structure

```bash
rest-api/
├── config/
│   └── connectDB.js
├── middleware/
│   └── fetchUser.js
├── model/
│   └── users.js
├── routes/
│   └── auth.js
├── .env
├── index.js
└── package.json
```

## Available API Features

Your API now supports:

- User Registration
- Login Authentication
- JWT Protected Routes
- Fetch Logged In User
- Get All Users (Admin)
- Update User
- Delete User
- Role-Based Authorization

## Example Endpoints

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| POST   | /auth/newuser    | Register User |
| POST   | /auth/login      | Login         |
| POST   | /auth/getuser    | Current User  |
| POST   | /auth/users      | All Users     |
| PUT    | /auth/update/:id | Update User   |
| DELETE | /auth/delete/:id | Delete User   |

## Security Improvements You Can Add

For production, consider upgrading this API with:

- bcrypt instead of CryptoJS
- Refresh Tokens
- Rate Limiting
- Email Verification
- Helmet for security headers
- Request Logging
- Input Sanitization

## Final Thoughts

This covers the foundations of a real-world authentication API using Node and MongoDB. Once comfortable with this setup, you can extend it into:

- Blog APIs
- E-commerce APIs
- Role-Based Dashboards
- Microservices Authentication Systems

Happy coding 🚀
