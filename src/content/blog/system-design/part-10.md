---
title: "CDNs, Load Balancers & Proxies"
description: "Learn how CDNs reduce latency, how load balancers distribute traffic, the difference between forward and reverse proxies, and how modern systems handle traffic at scale."
pubDate: 2026-06-08T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../../assets/blog/system-design-cdn.avif
tags: ["system-design", "cdn", "load-balancing", "reverse-proxy", "networking", "scalability"]
featured: false
draft: false
series:
    name: "System Design"
    part: 10
---

## The Story: Highways, Traffic Cops, and Local Shops

- **Load Balancer:** The traffic cop at the city gate. Every car entering the city is directed to the least-congested road.
- **Reverse Proxy:** The city's reception desk. You never talk directly to departments — you talk to the receptionist who routes you.
- **Forward Proxy:** The city's VPN exit. You send your messages through a representative who talks to the outside world on your behalf.
- **CDN:** Local shops in every neighbourhood stocked with the most popular goods from the central warehouse.

---

## CDN: Content Delivery Networks

### How a CDN works

A CDN is a globally distributed network of servers (called **Points of Presence / PoPs / edge servers**) that cache content close to end users.

```
Without CDN:
User in Delhi → request → Origin Server in Virginia → 300ms round trip

With CDN:
User in Delhi → request → CDN PoP in Delhi → <10ms (cached content)
                                           → cache miss → Virginia → cache → serve
```

**CDN flow:**

```
1. User requests https://ritiktiwari.com/resume.pdf
2. DNS resolves to nearest CDN edge (Anycast routing)
3. Edge checks cache:
   HIT  → serve instantly (milliseconds)
   MISS → fetch from origin (ritiktiwari.com) → cache → serve
4. Next user in same region gets HIT
```

### Push CDN vs Pull CDN

**Pull CDN:** Content pulled from origin on first request, cached at edge.

```
User requests → CDN misses → CDN fetches from origin → caches → serves
```

- Low setup overhead (no pre-uploading)
- First user in each region gets slow response (cold cache)
- Good for: large, unpredictable content catalogs

**Push CDN:** You explicitly push content to edge nodes before users request it.

```
Deploy new image → Push to all CDN edges globally → Users always hit cache
```

- Always fast (no cold miss)
- More complex (must manage pushes)
- Good for: known-popular content, marketing launches, games

### Cache-Control headers — the language of CDNs

```http
Cache-Control: public, max-age=31536000, immutable
```

| Directive    | Meaning                                              |
| ------------ | ---------------------------------------------------- |
| `public`     | CDNs and browsers may cache this                     |
| `private`    | Browser only, not CDN (personalised content)         |
| `max-age=N`  | Cache for N seconds                                  |
| `no-cache`   | Must revalidate before serving from cache            |
| `no-store`   | Never cache                                          |
| `immutable`  | Content will never change (bust by URL, not headers) |
| `s-maxage=N` | CDN-specific TTL (overrides max-age for CDN)         |

### URL-based cache busting

For files with `max-age=31536000 immutable`, how do you update them?

```html
<!-- Old version: cached forever -->
<script src="/app.js?v=1.0.0"></script>

<!-- New deploy: new URL → cache miss → fresh download -->
<script src="/app.js?v=1.2.3"></script>

<!-- Or: content hash (Webpack, Vite, etc.) -->
<script src="/app.abc123def456.js"></script>
```

The URL changes → CDN treats it as a brand new resource → serves fresh content.

### CDN for dynamic content

CDNs aren't just for static assets. Modern CDNs can cache:

- API responses (with `Cache-Control: public, s-maxage=60`)
- Rendered HTML pages
- Database query results (via edge computing)

**Edge computing (Cloudflare Workers, AWS Lambda@Edge):**
Run serverless code at the CDN edge — personalisation, A/B testing, auth without hitting origin.

```javascript
// Cloudflare Worker — runs at edge globally
addEventListener("fetch", (event) => {
	event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
	const country = request.cf.country;
	if ("IN" === country) {
		return fetch("https://india.api.example.com" + request.url);
	}
	return fetch("https://us.api.example.com" + request.url);
}
```

### Major CDN providers

| Provider       | Strengths                                               |
| -------------- | ------------------------------------------------------- |
| Cloudflare     | Security (DDoS), edge compute, free tier, easiest setup |
| AWS CloudFront | Deep AWS integration, Lambda@Edge                       |
| Fastly         | Instant purge (<150ms), real-time config, Varnish-based |
| Akamai         | Largest network, enterprise, media streaming            |

---

## Load Balancers

### What does a load balancer do?

A load balancer distributes incoming traffic across multiple servers, preventing any one server from becoming a bottleneck.

```
                   ┌─→ [App Server 1]
[Clients] → [LB] ──┼─→ [App Server 2]
                   └─→ [App Server 3]
```

**Additional responsibilities (modern LBs):**

- Health checking (stop sending traffic to failed servers)
- SSL/TLS termination (decrypt HTTPS, forward HTTP internally)
- Sticky sessions (route same user to same server)
- Request logging and metrics
- Connection draining (gracefully remove server during deployment)

### Load Balancing Algorithms

#### Round Robin

Requests go to servers in rotation: 1, 2, 3, 1, 2, 3...

```
Request 1 → Server 1
Request 2 → Server 2
Request 3 → Server 3
Request 4 → Server 1  (cycles)
```

**Best for:** Servers with equal capacity. Requests take similar time.

#### Weighted Round Robin

Same as round robin but servers get traffic proportional to weight.

```
Server 1: weight=3 → gets 60% of traffic
Server 2: weight=2 → gets 40% of traffic
Order: 1,1,1,2,2,1,1,1,2,2...
```

**Best for:** Mixed server capacities (some servers are more powerful).

#### Least Connections

New request goes to the server with fewest active connections.

```
Server 1: 47 active connections
Server 2: 12 active connections  ← send next request here
Server 3: 31 active connections
```

**Best for:** Long-lived connections (chat, file uploads). Variable request duration.

#### Least Response Time

Send to the server with the lowest average response time.

**Best for:** When server response times vary significantly.

#### IP Hash

`server = hash(client_IP) % number_of_servers`

Same client always goes to same server.

**Best for:** Session stickiness when you can't use distributed session storage.  
**Downside:** Uneven distribution if many users share an IP (corporate NAT). Breaks if you add/remove servers (hash changes).

#### Consistent Hashing (for L7)

Same concept as DB sharding — used in service meshes (Envoy) for session affinity without the problems of IP hash.

### Layer 4 vs Layer 7 Load Balancing

|                       | L4 (Transport)                 | L7 (Application)             |
| --------------------- | ------------------------------ | ---------------------------- |
| Operates at           | TCP/UDP                        | HTTP, gRPC                   |
| Routing based on      | IP + Port                      | URL, headers, cookies, body  |
| Speed                 | Faster (no content inspection) | Slower (must parse HTTP)     |
| SSL termination       | No (or passthrough)            | Yes                          |
| Content-based routing | No                             | Yes                          |
| Examples              | AWS NLB, HAProxy (L4 mode)     | AWS ALB, Nginx, HAProxy (L7) |

**L4 use:** TCP/UDP apps, databases, game servers, when minimal overhead matters.  
**L7 use:** HTTP APIs, microservices routing, A/B testing, canary deployments.

### Health Checks

LBs continuously check if servers are healthy.

```
Active health check (LB probes servers):
LB → GET /health → Server 1 → 200 OK  → healthy
LB → GET /health → Server 2 → timeout → unhealthy     → remove from pool
LB → GET /health → Server 2 → 200 OK  → healthy again → return to pool

Passive health check (LB observes traffic):
If >5% of responses to Server 3 are 5xx → mark unhealthy
```

**Connection draining:** When removing a server (deployment, maintenance), the LB stops sending new requests but lets existing requests complete.

### High Availability for the Load Balancer Itself

The LB is itself a potential SPOF. Solution:

**Active-Passive pair:**

```
[Clients] → Virtual IP (VIP)
                  ↓
            [Primary LB] (active, holds VIP)
            [Standby LB] (watches primary via heartbeat)

If Primary fails:
Standby detects → takes over VIP → becomes active
VRRP protocol manages this automatically (<1 second failover)
```

**DNS-based:** Multiple LB IPs returned in DNS. Client tries another on failure.

**Anycast:** Same IP announced from multiple locations — routing naturally directs to closest.

---

## Proxies: Forward and Reverse

### Forward Proxy: You → Proxy → Internet

```
[Client] → [Forward Proxy] → [Internet]
```

The internet sees the proxy's IP, not the client's.

**Use cases:**

- Corporate: route all employee traffic through proxy (filtering, monitoring)
- VPN services: hide client IP
- Bypass geo-restrictions
- Cache responses for all clients on a network

**The client configures the forward proxy.** The destination server doesn't know about it.

### Reverse Proxy: Client → Proxy → Your Servers

```
[Client] → [Reverse Proxy] → [Server 1]
                           → [Server 2]
```

The client sees only the proxy's IP. Internal servers are hidden.

**Use cases:**

- Load balancing (Nginx, HAProxy)
- SSL termination (decrypt HTTPS once, forward HTTP internally)
- Caching (Varnish, Nginx)
- API gateway (rate limiting, auth)
- Security (hide internal architecture)

**The client doesn't know about the reverse proxy.** It just talks to the proxy thinking it's the server.

### Nginx as a Reverse Proxy

```nginx
# nginx.conf — basic reverse proxy
http {
    upstream app_servers {
        least_conn;  # algorithm
        server 10.0.0.1:8080 weight=3;
        server 10.0.0.2:8080 weight=2;
        server 10.0.0.3:8080;  # default weight=1
        keepalive 32;  # connection pool
    }

    server {
        listen 443 ssl;
        server_name api.example.com;

        ssl_certificate /etc/ssl/cert.pem;
        ssl_certificate_key /etc/ssl/key.pem;

        location / {
            proxy_pass http://app_servers;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_connect_timeout 3s;
            proxy_read_timeout 30s;
        }

        location ~* \.(jpg|png|css|js)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            proxy_pass http://app_servers;
        }
    }
}
```

### Service Mesh: Proxies for Microservices

In a microservices world, every service-to-service call needs:

- mTLS (mutual authentication)
- Retry logic
- Circuit breaking
- Metrics and tracing
- Load balancing

**Service mesh:** A sidecar proxy runs next to every service instance, handling all of the above transparently.

```
[Service A] → [Envoy Sidecar A] → [Envoy Sidecar B] → [Service B]
                    ↓                       ↓
                 [Control Plane: Istio / Linkerd]
                (configures all sidecars centrally)
```

**The developer** writes `service_b.send_request()` — the sidecar handles mTLS, retries, circuit breaking automatically.

**Tools:** Istio (Envoy-based), Linkerd, Consul Connect

---

## Flashcards

**Q: Design the traffic ingress for a large system**

> Traffic enters through Cloudflare for DDoS protection and edge caching of static assets. DNS points to our load balancer cluster (active-passive HA pair using VRRP). The L7 load balancer (AWS ALB or Nginx) does SSL termination, routes to the correct service based on URL path, and health-checks backend servers. Servers receive HTTP internally. For microservice-to-microservice, we use a service mesh (Envoy/Istio) for mTLS, retries, and observability.

**Q: When would you use a CDN?**

> CDN for anything static — JS, CSS, images, videos, downloadable files. Also for API responses that are public and can be cached (product catalog, public content). Cache-Control headers tell the CDN how long to cache. URL-based cache busting for static assets (content hash in filename). Pull CDN for most cases; push CDN for known-popular content before launch.

**Q: What is the difference between a forward proxy and a reverse proxy?**

> Forward proxy acts on behalf of clients (hides client identity). Reverse proxy acts on behalf of servers (hides server infrastructure). Clients configure forward proxies; servers configure reverse proxies.

**Q: What does SSL termination mean in load balancing?**

> The load balancer decrypts HTTPS traffic, then forwards plain HTTP to backend servers. Offloads crypto from app servers.

**Q: What is L4 vs L7 load balancing?**

> L4 routes based on IP and port (fast, no content inspection). L7 routes based on HTTP content (URL, headers, cookies) — enables content-based routing, canary deploys.

**Q: What is connection draining?**

> When removing a server from the pool, the LB stops sending new connections but allows existing connections to complete gracefully.

**Q: What is cache busting in CDNs?**

> Changing the URL of a resource (e.g., including a version hash) so CDNs treat it as a new resource and fetch fresh content from origin.

**Q: What is a service mesh?**

> A network of sidecar proxies that handle inter-service communication concerns (mTLS, retries, circuit breaking, observability) transparently, managed by a central control plane.
