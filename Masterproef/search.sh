#!/bin/sh
total=0

for f in "inleiding" "literatuurstudie" "raamwerken" "vergelijking" "evaluatie" "besluit"
do
	# -c count
	# -i case insensitive
	# -e regular expression
	nb=`cat $f.tex | grep -c -i -e $1`
	total=$((total + $nb))
	echo "==================== $f ($nb matches) ===================="

	if [ "$nb" -gt "0" ]; then
		# --color	color the occurrences
		# -n 		show line number
		# -i 		case insensitive
		# -e 		regular expression
		cat "$f.tex" | grep --color -n -i -e $1
	fi
	
done

echo "\n"
echo "////////////////////////"
echo " Total: $total matches"
echo "////////////////////////"