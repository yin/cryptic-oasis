#!/bin/sh

url=localhost:5000/api/transactions
data="{"

if ! test -z $1; then
    id=$1
else
	echo "usage: delete_transaction.sh <id>"
fi

if ! test -z $2; then
    amount=$2
    data="${data} \"amount\": ${amount}"
fi

if ! test -z $3; then
    d=$3
    data="${data}, \"date\": \"${d}\""
fi
data="${data}}"

set -x
curl -v -X POST -H 'Content-Type: application/json' --data "$data" $url/$id
