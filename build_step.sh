#!/bin/bash

set -e

echo "Starting production build"

# Backend build
echo "Building backend..."
npm install
npm run tsc

# Frontend build
echo "Building frontend..."
(cd frontend && npm install && npm run build)

echo "Build finished successfully"

