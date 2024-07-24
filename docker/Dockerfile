# STEP1: CLONE THE CODE
FROM alpine:latest as builder_prepare
ARG CACHEBUST=1
WORKDIR /home/
RUN apk add git && \
    git clone --depth 1 https://github.com/messidagod/filestash

# STEP2: BUILD THE FRONTEND
FROM node:18-alpine AS builder_frontend
WORKDIR /home/
COPY --from=builder_prepare /home/filestash/ ./
RUN apk add --no-cache make git gzip brotli && \
    npm install --legacy-peer-deps && \
    make build_frontend && \
    cd public && make compress

# STEP3: BUILD THE BACKEND
FROM golang:1.21-bookworm AS builder_backend
WORKDIR /home/
COPY --from=builder_frontend /home/ ./
RUN apt-get update > /dev/null && \
    apt-get install -y libvips-dev curl make libjpeg-dev libtiff-dev libpng-dev libwebp-dev libraw-dev libheif-dev libgif-dev > /dev/null 2>&1 && \
    make build_init && \
    make build_backend && \
    mkdir -p ./dist/data/state/config/ && \
    cp config/config.json ./dist/data/state/config/config.json

# STEP4: Create the prod image from the build
FROM debian:stable-slim
LABEL maintainer="joeshakely@gmail.com"
COPY --from=builder_backend /home/dist/ /app/
WORKDIR "/app"
RUN apt-get update > /dev/null && \
    apt-get install -y --no-install-recommends apt-utils && \
    apt-get install -y curl emacs-nox ffmpeg zip poppler-utils > /dev/null && \
    # org-mode: html export
    curl https://raw.githubusercontent.com/mickael-kerjean/filestash/master/server/.assets/emacs/htmlize.el > /usr/share/emacs/site-lisp/htmlize.el && \
    # org-mode: markdown export
    curl https://raw.githubusercontent.com/mickael-kerjean/filestash/master/server/.assets/emacs/ox-gfm.el > /usr/share/emacs/site-lisp/ox-gfm.el && \
    # org-mode: pdf export (with a light latex distribution)
    cd && apt-get install -y wget perl > /dev/null && \
    export CTAN_REPO="http://mirror.las.iastate.edu/tex-archive/systems/texlive/tlnet" && \
    curl -sL "https://yihui.name/gh/tinytex/tools/install-unx.sh" | sh && \
    mv ~/.TinyTeX /usr/share/tinytex && \
    /usr/share/tinytex/bin/$(uname -m)-linux/tlmgr install wasy ulem marvosym wasysym xcolor listings parskip float wrapfig sectsty capt-of epstopdf-pkg cm-super && \
    ln -s /usr/share/tinytex/bin/$(uname -m)-linux/pdflatex /usr/local/bin/pdflatex && \
    apt-get purge -y --auto-remove perl wget && \
    # Cleanup
    find /usr/share/ -name 'doc' | xargs rm -rf && \
    find /usr/share/emacs -name '*.pbm' | xargs rm -f && \
    find /usr/share/emacs -name '*.png' | xargs rm -f && \
    find /usr/share/emacs -name '*.xpm' | xargs rm -f

RUN useradd filestash && \
    chown -R filestash:filestash /app/ && \
    find /app/data/ -type d -exec chmod 770 {} \; && \
    find /app/data/ -type f -exec chmod 760 {} \; && \
    chmod 730 /app/filestash && \
    rm -rf /var/lib/apt/lists/* && \
    rm -rf /tmp/*

USER filestash
CMD ["/app/filestash"]
EXPOSE 8334
