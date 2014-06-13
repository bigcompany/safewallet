echo "starting monitor"

export DEBUG="alert"

mon -d "node ../bin/monitor" --log "../logs/monitor.log" --attempts 3