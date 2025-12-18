@echo off

echo Starting backend...
docker-compose -f backend\docker-compose.yml up -d

echo Starting frontend...
docker-compose -f frontend\docker-compose.yml up -d

echo All services started.
pause
