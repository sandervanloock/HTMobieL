#!/usr/bin/python

import sys

f = open(str(sys.argv[1])) 
print "INPUT: " + sys.argv[1]
print "OUTPUT: " + sys.argv[1][:-4] + "-tex.bib"
o = open(str(sys.argv[1][:-4]) + "-tex.bib", "w") 
while 1: 
	line = f.readline() 
	if not line: break 
	line = line.replace("url = {", 'howpublished = {\url{') 
	line = line.replace("urldate = {",'note = "[Online; accessed ')
	if line[0:21] == 'howpublished = {\url{': 
		line = line[0:-3] 
		line = line + '}},\n' 
	if line[0:9] == 'note = "[':
		line = line[0:-3]
		line = line + ']"\n'
	o.write(line) 
o.close() 
f.close()


