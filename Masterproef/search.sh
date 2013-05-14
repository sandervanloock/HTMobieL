#!/bin/sh
total=0

for f in "masterproef" "inleiding" "literatuurstudie" "raamwerken" "vergelijking" "evaluatie-populariteit" "evaluatie-productiviteit" "evaluatie-gebruik" "evaluatie-ondersteuning" "evaluatie-performantie" "evaluatie-spinnenweb" "besluit" "app-ondersteuning" "app-performantie"
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