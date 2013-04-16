#!/bin/sh

forbiddenWords=(we men je u framework device plugin layout markup)
unset regexp

for w in ${forbiddenWords[@]};
do
    regexp="${regexp}${w}\|"
done

# delete last 2 characters and add brackets
fullexp="\(${regexp%??}\)"
#ignore comment lines in tex-files
sh search.sh "^[^%].*\b\b$fullexp\b"
