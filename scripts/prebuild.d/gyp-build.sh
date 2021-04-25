#!/bin/bash
cd "$(dirname "$0")/../../"
node-gyp configure && node-gyp build
