---
title: "Authentication, Authorization, JWT, OAuth2 & Security"
description: "Master authentication, authorization, JWTs, OAuth 2.0, OpenID Connect, RBAC, MFA, password security, session management, and scalable auth system design for system design interviews and production applications."
pubDate: 2026-06-16T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../../assets/blog/system-design-authentication.avif
tags:
    [
        "system-design",
        "authentication",
        "authorization",
        "jwt",
        "oauth2",
        "oidc",
        "rbac",
        "abac",
        "acl",
        "sessions",
        "tokens",
        "mfa",
        "pkce",
        "openid-connect",
        "access-token",
        "refresh-token",
        "identity-management",
        "api-security",
    ]
featured: false
draft: true
series:
    name: "System Design"
    part: 12
---

## The Story: The Gated City

**Authentication** = Proving who you are at the city gate. The guard checks your passport (identity). _"Are you who you say you are?"_

**Authorization** = What you're allowed to do inside the city. Your visa says "tourist" — you can visit museums but not access government buildings. _"Are you allowed to do this?"_

These are two different questions. You must answer both, in order.

---

## Authentication vs Authorization

|           | Authentication (AuthN)     | Authorization (AuthZ)        |
| --------- | -------------------------- | ---------------------------- |
| Question  | Who are you?               | What can you do?             |
| Mechanism | Password, biometric, OTP   | Roles, permissions, policies |
| Output    | Identity (user_id, claims) | Allow / Deny                 |
| Happens   | First                      | Second (after AuthN)         |
| Standards | OAuth2, OIDC, SAML         | RBAC, ABAC, ACLs             |

**A common confusion:** OAuth2 is an **authorization** framework — it grants access tokens. OpenID Connect (OIDC) is the **authentication** layer built on top of OAuth2.

---

## Sessions vs Tokens

### Session-Based Authentication (Stateful)

```
1. User logs in with username + password
2. Server verifies credentials
3. Server creates a session: { session_id: "xyz123", user_id: 42, expires: T+24h }
4. Server stores session in DB or Redis
5. Server sends Set-Cookie: session_id=xyz123 to browser
6. Browser sends cookie with every request
7. Server looks up session_id in Redis → gets user_id → request proceeds
```

**Problems:**

- Server must maintain session state (not stateless)
- Horizontal scaling needs shared session store (Redis)
- Session store becomes bottleneck / SPOF

### Token-Based Authentication (Stateless) — JWT

**JWT (JSON Web Token):** A signed token containing claims. Server verifies signature — no DB lookup needed.

**JWT Structure:**

```
header.payload.signature

Header (base64url encoded):
{
	"alg": "HS256",
	"typ": "JWT"
}

Payload (base64url encoded):
{
	"sub": "42",                 ← user_id
	"email": "[EMAIL_ADDRESS]",
	"roles": ["user", "admin"],
	"iat": 1706745600,           ← issued at
	"exp": 1706832000            ← expires at
}

Signature:
HMACSHA256(base64(header) + "." + base64(payload), secret_key)
```

**Verification:**

```python
import jwt

def verify_token(token):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=["HS256"]
        )
        return payload  # contains user_id, roles, etc.
    except jwt.ExpiredSignatureError:
        raise UnauthorizedException("Token expired")
    except jwt.InvalidTokenError:
        raise UnauthorizedException("Invalid token")
```

**Why JWT is stateless:** The server only needs the secret key to verify any token. No DB lookup. No shared state. Horizontally scales perfectly.

### JWT Trade-offs

| Advantage                     | Disadvantage                                             |
| ----------------------------- | -------------------------------------------------------- |
| Stateless — no DB lookup      | Can't invalidate before expiry                           |
| Scales horizontally           | Token grows with claims                                  |
| Self-contained claims         | Must rotate secret key carefully                         |
| Works across domains/services | Payload is only base64 encoded — don't put secrets in it |

### The JWT Revocation Problem

**Problem:** User logs out. JWT is valid for another 23 hours. If the token is stolen, attacker has 23 hours.

**Solutions:**

1. **Short-lived access tokens:** Expire in 15 minutes. Use refresh tokens for new access tokens.

```
Access token : 15 minutes TTL → short window of vulnerability
Refresh token: 30 days TTL    → stored securely, used to get new access tokens

If access token stolen  : attacker has 15 minutes
If refresh token stolen : user/system can revoke it (it's in DB)
```

2. **Token blacklist (Redis):** On logout, add JWT ID (jti) to Redis blacklist with TTL = token's remaining lifetime.

```python
def logout(token):
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    remaining_ttl = payload['exp'] - time.time()
    redis.setex(f"blacklist:{payload['jti']}", int(remaining_ttl), 1)

def verify_token(token):
    payload = jwt.decode(...)
    if redis.exists(f"blacklist:{payload['jti']}"):
        raise UnauthorizedException("Token revoked")
    return payload
```

This re-introduces Redis dependency but is a targeted lookup (only blacklisted tokens).

---

## OAuth 2.0: Delegated Authorization

**Story:** You want to print photos using a print shop. Instead of giving the print shop your Google Photos password, you authorize Google to give the print shop read-only access to your photos. The print shop never sees your password.

**OAuth 2.0 solves:** "How do I grant third-party app X access to my data on service Y, without sharing my password with X?"

### The Four OAuth 2.0 Flows

#### Authorization Code Flow (for web apps with backend)

```
1. User clicks "Login with Google" on your app
2. Your app → redirects user to Google:
   https://accounts.google.com/oauth/authorize?
     client_id=YOUR_APP_ID
     &redirect_uri=https://yourapp.com/callback
     &scope=email profile
     &response_type=code
     &state=random_csrf_token

3. User logs in to Google, consents to permissions
4. Google → redirects user back to your app:
   https://yourapp.com/callback?code=AUTH_CODE&state=random_csrf_token

5. Your backend → exchanges code for tokens:
   POST https://oauth2.googleapis.com/token
   { code: AUTH_CODE, client_secret: YOUR_SECRET, ... }

6. Google → returns:
   { access_token: "...", refresh_token: "...", id_token: "..." }

7. Your app uses access_token to call Google APIs on user's behalf
```

**Why code exchange? Security:** The authorization code travels through the browser (URL redirect) — potentially visible. The code is exchanged for tokens in a backend-to-backend call (not browser), so tokens never touch the browser URL.

#### PKCE (Proof Key for Code Exchange) — for mobile/SPA

Mobile apps can't securely store a `client_secret`. PKCE adds a code challenge/verifier so the code can only be exchanged by the original requester.

```python
# 1. Generate code verifier and challenge
code_verifier = base64.urlsafe_b64encode(os.urandom(32)).rstrip(b'=').decode()
code_challenge = base64.urlsafe_b64encode(
    hashlib.sha256(code_verifier.encode()).digest()
).rstrip(b'=').decode()

# 2. Send code_challenge in authorization request
# 3. Send code_verifier in token exchange
# Server verifies: SHA256(code_verifier) == code_challenge
```

#### Client Credentials Flow (for machine-to-machine)

```
Service A   → POST /oauth/token { client_id, client_secret, grant_type=client_credentials }
Auth Server → { access_token: "..." }
Service A   → uses access_token to call Service B APIs
```

No user involved. Service authenticates as itself.

### OpenID Connect (OIDC)

OAuth 2.0 + **ID token** = OpenID Connect. The `id_token` is a JWT containing the user's identity.

```json
{
  "iss": "https://accounts.google.com",
  "sub": "1098765432",              ← Google's user ID
  "email": "contact@ritiktiwari.com",
  "name": "Ritik Tiwari",
  "picture": "https://...",
  "aud": "your-client-id",
  "exp": 1706832000
}
```

OIDC is the standard for "Login with Google/GitHub/Apple/Microsoft" — you get the user's identity in a standardised format.

---

## Authorization Models

### RBAC — Role-Based Access Control

Users are assigned roles. Roles have permissions.

```
Roles:
  admin  → [read, write, delete, manage_users]
  editor → [read, write]
  viewer → [read]

User Ritik → role: editor → can read and write, not delete or manage_users

DB schema:
users → user_roles → roles → role_permissions → permissions
```

**Pros:** Simple to understand, easy to audit  
**Cons:** Role explosion (50 departments × 10 roles = 500 roles), hard to do fine-grained permissions

### ABAC — Attribute-Based Access Control

Policies evaluate combinations of attributes (user, resource, environment).

```python
def can_access(user, resource, action, context):
    # Policy: user can edit their own posts during business hours
    if action == "edit" and resource.type == "post":
        return (
            user.id == resource.author_id and
            context.hour in range(9, 18) and
            user.department == resource.department
        )
    return False
```

**Pros:** Fine-grained, flexible  
**Cons:** Complex to manage, hard to audit ("why can't I do X?")

### ACL — Access Control List

Each resource has a list of who can do what.

```
Document #42:
  user_1       → read, write
  user_2       → read
  group_admins → read, write, delete
```

Used by: Google Drive, AWS S3 bucket policies, Unix file permissions (rwx).

### RBAC with Resource Ownership (Practical Hybrid)

```python
def can_edit_post(user, post_id):
    post = get_post(post_id)

    # Check roles first
    if user.has_role("admin"):
        return True

    # Check resource ownership
    if post.author_id == user.id:
        return True

    # Check team-level permission
    if user.has_role("editor") and post.team_id in user.team_ids:
        return True

    return False
```

Most practical systems combine RBAC (coarse) with ownership checks (fine-grained).

---

## Password Security

### Hashing (Never store plaintext passwords)

```python
import bcrypt

# Hash on registration
password = "user_secret_123"
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))
# Store hashed in DB — looks like: $2b$12$R.f5...

# Verify on login
def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode(), hashed_password)
```

**Why bcrypt (not SHA256)?**

- bcrypt is intentionally slow (work factor). Making 12 = 2^12 iterations = ~250ms per hash.
- SHA256 is fast — attackers can compute billions/second. bcrypt limits to ~4/second per core.
- bcrypt includes salt automatically (prevents rainbow table attacks)

**Alternatives:** Argon2 (even better, winner of Password Hashing Competition), scrypt.

### Common Auth Vulnerabilities

| Attack                | Description                                      | Prevention                        |
| --------------------- | ------------------------------------------------ | --------------------------------- |
| Brute force           | Try all passwords                                | Rate limit login, account lockout |
| Credential stuffing   | Use leaked username/password pairs               | Check against HaveIBeenPwned, MFA |
| CSRF                  | Trick browser into making authenticated requests | CSRF token, SameSite cookie       |
| XSS                   | Steal tokens from browser                        | HttpOnly cookies, CSP header      |
| JWT secret compromise | Forge any token                                  | Rotate secrets, short expiry      |
| SQL injection         | Extract hashed passwords from DB                 | Parameterised queries             |

---

## Multi-Factor Authentication (MFA)

Authentication factors:

- **Something you know:** Password, PIN
- **Something you have:** Phone (OTP), hardware key (YubiKey)
- **Something you are:** Fingerprint, Face ID

MFA = two or more factors.

### TOTP (Time-based One-Time Password)

```
1. User enables MFA → server generates secret key S
2. S shared to user's authenticator app (Google Auth, Authy)
3. Every 30 seconds: OTP = HOTP(S, floor(time/30))
   → Authenticator app and server compute same OTP using same S and time
4. Login: user enters password + 6-digit OTP from app
5. Server verifies OTP: compute TOTP(S) and compare
```

No network needed. Works offline. Standard RFC 6238.

---

## Designing an Auth System for Scale

### The auth service architecture

```
[Client] → [API Gateway] → validates JWT (no service call needed for stateless JWT)
                         → [Auth Service] (for login, signup, token refresh)
                         → [Resource Services] (user has been authenticated)

Auth Service owns:
  - Login/signup endpoints
  - Token issuance (access + refresh)
  - Token refresh
  - OAuth flows
  - MFA
  - Password reset
```

### Token refresh flow

```
Client has:
  access_token  (valid 15 minutes)
  refresh_token (valid 30 days, stored in HttpOnly cookie)

T=0:    Client makes API request with access_token → success
T=14m:  Client makes API request → 401 Unauthorized (expired)
T=14m:  Client sends refresh_token to /auth/refresh
T=14m:  Auth Service:
          - validates refresh_token (check DB, not expired, not revoked)
          - issues new access_token (15 min)
          - optionally rotate refresh_token (sliding expiry)
          - returns new access_token
T=14m:  Client retries original request with new access_token → success
```

### Where to store tokens in browsers

| Storage                           | XSS risk              | CSRF risk       | Access from JS |
| --------------------------------- | --------------------- | --------------- | -------------- |
| localStorage                      | HIGH (JS can read it) | None            | Yes            |
| sessionStorage                    | HIGH (JS can read it) | None            | Yes            |
| HttpOnly Cookie                   | None (JS can't read)  | YES (auto-sent) | No             |
| HttpOnly + SameSite=Strict Cookie | None                  | None            | No             |

**Best practice:** Store refresh token in `HttpOnly; SameSite=Strict` cookie. Store access token in memory (JS variable) — lost on page refresh, which is acceptable since refresh token re-issues it.

---

## Flashcards

**Q: Design an authentication system**

> I'd use JWT for stateless auth with short-lived access tokens (15 min) and longer-lived refresh tokens (30 days). On login, validate credentials, hash comparison with bcrypt, issue both tokens. Access token in memory/header, refresh token in HttpOnly SameSite cookie. API gateway validates JWT signature without calling auth service — scales independently. For logout, add jti to Redis blacklist. For OAuth, use PKCE flow for mobile/SPA, Authorization Code for backend. MFA via TOTP for sensitive accounts.

**Q: What is the difference between authentication and authorization?**

> Authentication = who you are (identity). Authorization = what you're allowed to do (permissions). AuthN happens first.

**Q: What makes JWT stateless?**

> The server verifies the signature using only its secret key — no DB or session store lookup needed.

**Q: What is the JWT revocation problem?**

> JWTs can't be invalidated before expiry. Solutions: short expiry (15 min) + refresh tokens, or jti blacklist in Redis.

**Q: What is PKCE and why is it needed?**

> Proof Key for Code Exchange — adds a cryptographic challenge to OAuth's Authorization Code flow for mobile/SPA apps that can't safely store a `client_secret`.

**Q: Why use bcrypt instead of SHA256 for password hashing?**

> bcrypt is intentionally slow (configurable work factor). Limits brute-force attempts. Includes automatic salt. SHA256 is fast — attackers can compute billions/second.

**Q: What is RBAC?**

> Role-Based Access Control — users assigned roles, roles have permissions. Simple, auditable, but coarse-grained.

**Q: Where should refresh tokens be stored in a browser?**

> HttpOnly, SameSite=Strict cookie. Not accessible to JavaScript (prevents XSS theft). SameSite prevents CSRF.
