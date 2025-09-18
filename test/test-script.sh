#!/bin/bash -eu

(
  set -x
  curl \
      -H 'Content-Type: application/json' \
      -d '{"x": "this is x", "y": [10,20,30]}' \
      -v \
      http://localhost:10000/
)

echo