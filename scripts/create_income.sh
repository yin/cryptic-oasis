#!/bin/sh

url=localhost:5000/api/transactions

if ! test -z $1; then
	amount=$1
else
	amount=1000
fi

if ! test -z $2; then
	d=$2
else
	d=$(date --rfc-2822)
fi

set -x
curl -v -X POST -H 'Content-Type: application/json' --data "{\"amount\": $amount, \"date\": \"$d\"}" $url
