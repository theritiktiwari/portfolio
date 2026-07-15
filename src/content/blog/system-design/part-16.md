---
title: "Docker & Kubernetes — Containerization and Orchestration at Scale"
description: "Learn Docker containers, images, Docker Compose, Kubernetes architecture, Deployments, Services, HPA, health checks, StatefulSets, and modern CI/CD deployment patterns."
pubDate: 2026-07-15T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../../assets/blog/system-design-docker.avif
tags: ["system-design", "docker", "kubernetes", "devops", "containerization", "ci/cd"]
featured: false
draft: false
series:
    name: "System Design"
    part: 16
---

## The Story: Shipping Containers Changed the World

Before shipping containers, every port had different loading systems. Goods had to be repacked for each ship. Slow, expensive, error-prone.

The invention of the standardised shipping container changed everything. You could pack goods once into a standard container, and it would load onto any ship, any train, any truck — without repacking.

**Docker is the shipping container for software.** Pack your app once. Run anywhere.

---

## Docker: Containers

### The Problem Docker Solves

```
Developer:  "It works on my machine!"
Operations: "Then we'll ship your machine."

Before Docker:
  Dev machine:  Python 3.11, PostgreSQL 15, Redis 7
  Staging:      Python 3.9, PostgreSQL 13, Redis 6
  Production:   Python 3.10, PostgreSQL 14, Redis 6.2
  Result:       "Works on dev, fails in prod" bugs
```

Docker packages your app + all its dependencies into an **image** that runs identically everywhere.

### Key Concepts

```
Image:      A read-only template. The blueprint.
            Like a class definition in code.

Container:  A running instance of an image.
            Like an object instantiated from a class.

Dockerfile: The recipe for building an image.

Registry:   Where images are stored and shared.
            Docker Hub (public), AWS ECR, GCR (private)
```

### Writing a Dockerfile

```dockerfile
# Start from official Python image (base layer)
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy requirements first (for layer caching optimization)
COPY requirements.txt .

# Install dependencies (cached unless requirements.txt changes)
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user (security best practice)
RUN useradd --no-create-home appuser
USER appuser

# Document the port the app listens on
EXPOSE 8000

# Health check — Docker and Kubernetes will use this
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:8000/health || exit 1

# Command to run when container starts
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Layer Caching — The Key Optimization

Docker images are built in layers. Each instruction = one layer. Unchanged layers are cached.

```
Layer 1: FROM python:3.11-slim        ← cached (base image)
Layer 2: WORKDIR /app                 ← cached
Layer 3: COPY requirements.txt .      ← cached (file unchanged)
Layer 4: RUN pip install ...          ← cached (requirements.txt unchanged)
Layer 5: COPY . .                     ← INVALIDATED (code changed)
Layer 6: RUN useradd appuser          ← rebuilt (after invalidated layer)
Layer 7: CMD ...                      ← rebuilt

Result: only layers 5-7 rebuilt on code change → fast builds
```

**Rule:** Put things that change least often at the top. `requirements.txt` before `COPY . .`

### Docker Compose — Local Multi-Container Orchestration

```yaml
# docker-compose.yml
version: "3.8"

services:
    api:
        build: .
        ports:
            - "8000:8000"
        environment:
            - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
            - REDIS_URL=redis://redis:6379
        depends_on:
            db:
                condition: service_healthy
            redis:
                condition: service_started
        volumes:
            - .:/app # mount code for hot-reload in development

    db:
        image: postgres:15-alpine
        environment:
            POSTGRES_PASSWORD: password
            POSTGRES_DB: myapp
        volumes:
            - postgres_data:/var/lib/postgresql/data
        healthcheck:
            test: ["CMD-SHELL", "pg_isready -U postgres"]
            interval: 5s
            timeout: 5s
            retries: 5

    redis:
        image: redis:7-alpine
        ports:
            - "6379:6379"

    worker:
        build: .
        command: celery -A app worker --loglevel=info
        environment:
            - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
            - REDIS_URL=redis://redis:6379
        depends_on:
            - db
            - redis

volumes:
    postgres_data:
```

```bash
docker-compose up -d       # start all services in background
docker-compose logs -f api # tail logs
docker-compose down        # stop and remove containers
```

---

## Kubernetes: Container Orchestration

Docker runs containers on one machine. Kubernetes (K8s) runs containers across a **cluster of machines** — with automatic scaling, self-healing, and zero-downtime deployments.

**City analogy:** Docker is a house. Kubernetes is the city planning system that decides how many houses to build, where, what roads to use, and rebuilds burned-down houses automatically.

### The Kubernetes Architecture

```
Control Plane (the brain):
  ┌──────────────────────────────────────────────────────┐
  │  API Server     ← all kubectl commands hit here      │
  │  etcd           ← cluster state (all config in here) │
  │  Scheduler      ← decides which Node runs each Pod   │
  │  Controller Mgr ← ensures desired state is met       │
  └──────────────────────────────────────────────────────┘
                    ↕ manages
Worker Nodes (where your app runs):
  ┌─────────────────────────────┐
  │  Node 1                     │
  │  kubelet ← agent, runs Pods │
  │  kube-proxy ← networking    │
  │  [Pod][Pod][Pod]            │
  └─────────────────────────────┘
  ┌─────────────────────────────┐
  │  Node 2                     │
  │  kubelet                    │
  │  [Pod][Pod]                 │
  └─────────────────────────────┘
```

### Core Kubernetes Objects

#### Pod — The smallest deployable unit

```yaml
# pod.yaml
apiVersion: v1
kind: Pod
metadata:
    name: api-pod
    labels:
        app: api
spec:
    containers:
        - name: api
          image: myapp/api:v1.2.3
          ports:
              - containerPort: 8000
          resources:
              requests:
                  memory: "128Mi"
                  cpu: "250m" # 250 millicores = 0.25 CPU
              limits:
                  memory: "512Mi"
                  cpu: "1000m" # 1 full CPU
          livenessProbe:
              httpGet:
                  path: /health
                  port: 8000
              initialDelaySeconds: 10
              periodSeconds: 10
          readinessProbe:
              httpGet:
                  path: /ready
                  port: 8000
              periodSeconds: 5
```

**Never deploy pods directly** — use Deployments. Pods have no self-healing.

#### Deployment — Manages replica sets with rolling updates

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: api-deployment
spec:
    replicas: 3 # run 3 instances
    selector:
        matchLabels:
            app: api
    strategy:
        type: RollingUpdate
        rollingUpdate:
            maxSurge: 1 # create 1 extra pod during update
            maxUnavailable: 0 # never take a pod down before new one is ready
    template:
        metadata:
            labels:
                app: api
        spec:
            containers:
                - name: api
                  image: myapp/api:v1.2.4 # update image tag → triggers rolling update
                  # ... same as pod spec above
```

**Rolling update:** K8s creates new pods (v1.2.4), waits for them to become ready, then terminates old pods (v1.2.3). Zero downtime.

#### Service — Stable network endpoint for pods

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
    name: api-service
spec:
    selector:
        app: api # routes to all pods with label app=api
    ports:
        - protocol: TCP
          port: 80 # service port
          targetPort: 8000 # container port
    type: ClusterIP # internal only (default)
    # type: LoadBalancer    # external, creates cloud LB
    # type: NodePort        # exposes on each node's IP
```

#### Horizontal Pod Autoscaler (HPA)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
    name: api-hpa
spec:
    scaleTargetRef:
        apiVersion: apps/v1
        kind: Deployment
        name: api-deployment
    minReplicas: 2
    maxReplicas: 20
    metrics:
        - type: Resource
          resource:
              name: cpu
              target:
                  type: Utilization
                  averageUtilization: 70 # scale up when CPU > 70%
```

**Traffic spike:** CPU rises → HPA adds pods → load drops → HPA removes pods. Automatic.

#### ConfigMap and Secret — Configuration management

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
data:
  DATABASE_HOST: "postgres-service"
  REDIS_HOST: "redis-service"
  LOG_LEVEL: "INFO"

# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: api-secrets
type: Opaque
data:
  DATABASE_PASSWORD: cGFzc3dvcmQxMjM=  # base64 encoded
  JWT_SECRET: c2VjcmV0a2V5             # base64 encoded
```

**Note:** K8s Secrets are base64 encoded, not encrypted by default. Use Sealed Secrets or AWS Secrets Manager for true encryption.

---

## Kubernetes Patterns

### Health Checks: Liveness vs Readiness

```
Liveness probe:  Is this container still alive?
                 FAIL → K8s restarts the container
                 Use for: detecting deadlocks, infinite loops

Readiness probe: Is this container ready to receive traffic?
                 FAIL → K8s removes from load balancer (but doesn't restart)
                 Use for: app startup, temporary unavailability (DB migration)
```

```yaml
livenessProbe:
    httpGet:
        path: /health/live
        port: 8000
    initialDelaySeconds: 30 # wait 30s before first check (startup time)
    failureThreshold: 3 # restart after 3 consecutive failures

readinessProbe:
    httpGet:
        path: /health/ready # checks DB + cache connectivity
        port: 8000
    periodSeconds: 5
    failureThreshold: 2
```

### StatefulSets for Stateful Applications

Databases and stateful services need:

- Stable pod names (pod-0, pod-1, pod-2 — not random)
- Stable storage (each pod gets its own PersistentVolume)
- Ordered startup/shutdown

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
    name: postgres
spec:
    serviceName: "postgres"
    replicas: 3
    selector:
        matchLabels:
            app: postgres
    volumeClaimTemplates: # each pod gets its own PVC
        - metadata:
              name: postgres-data
          spec:
              accessModes: ["ReadWriteOnce"]
              resources:
                  requests:
                      storage: 100Gi
```

Pods are named: `postgres-0`, `postgres-1`, `postgres-2`. Primary election, replication — all consistent.

---

## CI/CD with Containers

### The deployment pipeline

```
Developer pushes code
        ↓
[GitHub Actions / GitLab CI]
  1. Run tests (unit, integration)
  2. Build Docker image
  3. Push image to registry (ECR/GCR)
  4. Update Kubernetes manifest (new image tag)
  5. Apply to staging → run smoke tests
  6. Apply to production (manual approval gate)
        ↓
[Kubernetes rolling update]
  New pods up → old pods down → zero downtime
```

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
    push:
        branches: [main]

jobs:
    build-and-deploy:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3

            - name: Run tests
              run: |
                  docker-compose -f docker-compose.test.yml up --exit-code-from tests

            - name: Build image
              run: |
                  IMAGE_TAG=${{ github.sha }}
                  docker build -t myapp/api:$IMAGE_TAG .

            - name: Push to ECR
              run: |
                  aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_URL
                  docker push myapp/api:$IMAGE_TAG

            - name: Deploy to K8s
              run: |
                  kubectl set image deployment/api-deployment api=myapp/api:$IMAGE_TAG
                  kubectl rollout status deployment/api-deployment
```

---

## Flashcards

**Q: How does containerization help system design?**

> Containers (Docker) package app + dependencies into a portable unit — eliminates environment inconsistency. Kubernetes orchestrates containers at scale: automatic horizontal scaling (HPA), self-healing (restarts failed containers), zero-downtime rolling updates, and service discovery. In my designs, each microservice runs as a K8s Deployment, scales independently via HPA, exposes itself via a K8s Service, and uses ConfigMaps/Secrets for configuration. This decouples the application from infrastructure.

**Q: Difference between Docker and Kubernetes?**

> Docker creates and runs containers on a single machine. Kubernetes orchestrates containers across a cluster of machines — handling scheduling, scaling, health checking, and networking. You use Docker to build the container image; Kubernetes to run it at scale.

**Q: What is a Docker image vs a Docker container?**

> Image = read-only template (like a class). Container = running instance of that image (like an object).

**Q: What is the Kubernetes control plane?**

> The brain of K8s — API Server (entry point), etcd (cluster state), Scheduler (assigns pods to nodes), Controller Manager (ensures desired state).

**Q: What is the difference between liveness and readiness probes?**

> Liveness = is container alive? (fail → restart). Readiness = is container ready for traffic? (fail → remove from LB, don't restart).

**Q: What is a Kubernetes Deployment?**

> Manages a set of replica pods with rolling update capability, self-healing, and scaling.

**Q: What is an HPA?**

> Horizontal Pod Autoscaler — automatically scales the number of pod replicas based on CPU, memory, or custom metrics.

**Q: Why is Docker layer caching important?**

> Unchanged layers are reused from cache → fast builds. Put rarely-changing instructions (dependencies) before frequently-changing ones (application code).
