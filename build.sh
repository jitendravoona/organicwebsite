#!/opt/render/project/src/.venv/bin/python
# Note: Above path is just a fallback. We will make it standard bash:
#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing requirements..."
pip install -r requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Running migrations..."
python manage.py migrate

echo "Seeding initial catalog (conditional)..."
python seed_data.py

echo "Build script completed successfully!"
