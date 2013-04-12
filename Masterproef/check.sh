#!/bin/sh
#regexp="\b\(we\|men\|je\)\b"
regexp="^[^%].*\b\(we\|men\|je\|framework\|device\|plugin\)\b"
#regexp="%.*\b\(we\|men\|je\)\b"

sh search.sh $regexp