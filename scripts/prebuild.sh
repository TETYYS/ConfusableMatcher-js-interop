#!/bin/bash
cd "$(dirname "$0")"

for f in prebuild.d/*; do
    extension="${f##*.}"
    case $extension in
        sh)
            bash "$f" -H || break
        ;;
        *)
            echo "Unknown prebuild script extension $extension"
            break
        ;;
    esac
done
