#!/usr/bin/env sh
jq '. | del(.exclude[]|select(contains("benchmark")))' tsconfig.build.json > out.tmp
rm tsconfig.build.json
mv out.tmp tsconfig.build.json
sudo 0x --kernel-tracing --kernel-tracing-debug --tree-debug --output-dir profiling -- node  --interpreted-frames-native-stack --perf-basic-prof-only-functions build/src/benchmark/index.js
zip -r profiling.zip profiling
