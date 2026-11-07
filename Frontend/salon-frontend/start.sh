#!/usr/bin/env bash
set -e
echo "============================================"
echo "  Shreyanshu Salon Frontend (JS) - Setup + Run"
echo "============================================"
echo
echo "[1/2] Installing dependencies (first run only, takes a minute)..."
npm install
echo
echo "[2/2] Starting the dev server..."
echo "Once it says 'Local: http://localhost:3000', open that link in your browser."
echo
npm run dev
