if [ -z "$1" ]
  then echo "currency is required. exiting deposits without running"
  exit 0
fi

echo "starting $1 deposits"

mon -d "node ../bin/deposits --currency $1" --log "../logs/deposits-$1.log" --attempts 3 --on-restart "./alerts/deposits/restarted --currency $1" --on-error "./alerts/deposits/crashed --currency $1"