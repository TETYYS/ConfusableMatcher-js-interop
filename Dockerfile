# syntax = docker/dockerfile:1.2

#
# Config
#
ARG NODE_VERSION=14

#
# Base Images
# Note (Robinlemon): We use buster since alpine uses musl instead of glibc.
#
# FROM mhart/alpine-node:slim-$NODE_VERSION as runtime_base
FROM node:$NODE_VERSION-buster-slim as runtime_base
# FROM mhart/alpine-node:$NODE_VERSION as builder_base
FROM node:$NODE_VERSION-buster as builder_base

FROM builder_base as builder
WORKDIR /usr/builder
# Install Build Dependencies
RUN rm -f /etc/apt/apt.conf.d/docker-clean
RUN --mount=type=cache,target=/var/cache/apt \
    apt-get update && \
    apt-get install -yqq --no-install-recommends make cmake g++ python bash && \
    rm -rf /var/lib/apt/lists/*
RUN --mount=type=cache,target=/root/.config/yarn/global \
    yarn global add \
    node-gyp
# Copy Files
COPY ./package.json ./yarn.lock .yarnclean ./
# Install Dependencies
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    yarn install \
    # Use yarn.lock
    --frozen-lockfile \
    # Dont look for yarnrc
    --no-default-rc \
    # All dependencies
    --production=false \
    # Delete old dependencies
    --force \
    # Check cache first
    --prefer-offline

FROM builder_base as common
WORKDIR /usr/builder
COPY tsconfig.base.json .prettierrc.js ./

FROM builder as development
# Copy Common
COPY --from=common /usr/builder ./
# Linting
COPY .eslintrc.js .eslintignore tsconfig.eslint.json tsconfig.json ./
# Runtime
ARG PACKAGE_NAME
ENV PACKAGE_NAME $PACKAGE_NAME
CMD ./docker-dev-entry.sh $PACKAGE_NAME

FROM builder as production
# Copy Common
COPY --from=common /usr/builder ./
# Build
RUN yarn build
# Prune Dependencies
ENV NO_POST_INSTALL=1
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    # Remove binding gyp so rebuilds don't occur
    rm -v ./binding.gyp && \
    # Purge dev deps
    yarn install \
    # Use yarn.lock
    --frozen-lockfile \
    # Dont look for yarnrc
    --no-default-rc \
    # Required dependencies
    --production=true \
    # Delete old dependencies
    --force \
    # Check cache first
    --prefer-offline
