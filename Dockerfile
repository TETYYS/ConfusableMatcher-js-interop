# syntax = docker/dockerfile:1.2

FROM ubuntu
RUN apt-get update
RUN apt-get install -y git
RUN git clone https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git

RUN git clone \
    --verbose \
    --depth 1  \
    --filter=blob:none  \
    --sparse \
    https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git \
    && cd linux \
    && git sparse-checkout set linux/tools/perf
RUN apt-get install -y build-essential flex bison curl sudo apt-utils vim cmake jq
RUN cd tools/perf/ && make all && cp perf /usr/bin/ && /usr/bin/perf -h
RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
RUN apt-get install -y nodejs
RUN rm -f /etc/apt/apt.conf.d/docker-clean
RUN --mount=type=cache,target=/root/.config/yarn/global yarn global add 0x
COPY . .
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn yarn install \
    --frozen-lockfile \
    --no-default-rc \
    --production=false \
    --force \
    --prefer-offline
RUN jq '. | del(.exclude[]|select(contains("benchmark")))' tsconfig.build.json > out.tmp && \
    rm tsconfig.build.json && \
    mv out.tmp tsconfig.build.json
RUN yarn build
ENTRYPOINT [ "/bin/sh" ]
CMD [ "./profile.sh" ]
