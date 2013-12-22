echo "starting frontend"

mon -d "node ../bin/frontend" --log "../logs/frontend.log" --attempts 3 --on-restart "./alerts/frontend/restarted" --on-error "./alerts/frontend/crashed"