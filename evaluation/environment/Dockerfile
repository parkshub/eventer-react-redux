FROM ubuntu:24.04@sha256:c35e29c9450151419d9448b0fd75374fec4fff364a27f176fb458d472dfc9e54

ENV DEBIAN_FRONTEND=noninteractive \
    PIP_BREAK_SYSTEM_PACKAGES=1 \
    MONGOMS_DOWNLOAD_DIR=/opt/mongodb-binaries \
    MONGOMS_VERSION=7.0.14

RUN apt-get update && apt-get install -y \
    git bash curl wget ca-certificates \
    python3 python3-pip python3-venv python3-dev \
    build-essential libcurl4t64 libssl3t64 \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_24.x -o /tmp/node-setup.sh \
    && bash /tmp/node-setup.sh \
    && apt-get install -y nodejs \
    && rm /tmp/node-setup.sh \
    && rm -rf /var/lib/apt/lists/* \
    && ln -sf /usr/bin/python3 /usr/bin/python \
    && mkdir -p /logs

WORKDIR /app

RUN git clone https://github.com/parkshub/eventer-react-redux.git . \
    && git checkout --detach 0913754e67ba3cff5b8f233270b51fa6f37c8a3a \
    && rm -rf .git \
    && npm ci --prefix tests \
    && node -e "require('./tests/node_modules/mongodb-memory-server-core').MongoBinary.getPath().catch(e => { console.error(e); process.exit(1) })"

ENV MONGOMS_RUNTIME_DOWNLOAD=false

COPY gitignore /tmp/harbor.gitignore
RUN cat /tmp/harbor.gitignore >> .gitignore && rm /tmp/harbor.gitignore

RUN git config --global user.email "eval@bench"; \
    git config --global user.name "Eval Runner"; \
    git init; \
    git add -A; \
    git commit -m "initialize repo" || true; \
    git tag v0.1.0-init

CMD ["bash"]
