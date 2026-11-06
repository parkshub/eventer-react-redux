#!/bin/bash
set -uo pipefail
mkdir -p /logs/verifier
echo 0 > /logs/verifier/reward.txt
cd /app || exit 0
fail=0
export MONGOMS_RUNTIME_DOWNLOAD=false
npm test || fail=1
node /app/tests/node_modules/jest/bin/jest.js --runInBand --config /tests/jest.config.cjs || fail=1
node /tests/check-source-syntax.cjs /app || fail=1
if [ "$fail" -eq 0 ]; then
    echo 1 > /logs/verifier/reward.txt
fi
exit 0
