# Build context is the REPO ROOT: the web build reads ../data at build time.
# ── build ──────────────────────────────────────────────────────────────
FROM node:24-alpine AS build
WORKDIR /repo

COPY web/package.json web/package-lock.json* ./web/
RUN cd web && npm ci --no-audit --no-fund

# data/ is committed ETL output; the build inlines it.
COPY data ./data
COPY web ./web
RUN cd web && npm run build

# ── serve ──────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS serve
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /repo/web/out /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Run unprivileged: nginx:alpine ships an unprivileged-friendly layout.
RUN touch /var/run/nginx.pid \
 && chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /usr/share/nginx/html
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1:8080/en/ >/dev/null || exit 1
CMD ["nginx", "-g", "daemon off;"]
