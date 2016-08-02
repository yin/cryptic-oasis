#!/bin/sh

url=localhost:5000/api/transactions
data="{"

if ! test -z $1; then
    id=$1
else
	echo "usage: get_transaction.sh <id>"
fi

set -x
curl -v -X GET -H 'Content-Type: application/json' $url/$id
