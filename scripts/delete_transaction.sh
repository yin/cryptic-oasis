#!/bin/sh

url=localhost:5000/api/transactions

if ! test -z $1; then
	id=$1
else
    echo "usage: delete_transaction.sh <id>" >&2
    exit 1
fi

set -x
curl -v -X DELETE $url/$id
