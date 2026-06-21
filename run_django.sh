#!/bin/bash

# GrownUp Organics - Local Django Setup & Run script
set -e

echo "=================================================="
echo "      GrownUp Organics - Django Web Server        "
echo "=================================================="

# Check python3 presence
if ! command -v python3 &> /dev/null; then
    echo "Error: python3 is not installed or not in PATH."
    echo "Please download and install Python 3.8+ to proceed."
    exit 1
fi

# Setup Venv
if [ ! -d ".venv" ]; then
    echo "[1/4] Creating virtual environment (.venv)..."
    python3 -m venv .venv
else
    echo "[1/4] Virtual environment (.venv) already exists."
fi

# Activate venv
echo "Activating virtual environment..."
source .venv/bin/activate

# Install requirements
echo "[2/4] Installing dependencies from requirements.txt..."
pip install --upgrade pip
pip install -r requirements.txt

# Run migrations
echo "[3/4] Running database migrations..."
python manage.py makemigrations shop
python manage.py migrate

# Seed Database
echo "[4/4] Seeding database with organic catalog (25 items)..."
python seed_data.py

# Launch server
echo ""
echo "=== Setup complete! Starting server ==="
echo "Open your browser at: http://127.0.0.1:8080"
echo "Press Ctrl+C to stop the server."
echo "======================================="
python manage.py runserver 8080
