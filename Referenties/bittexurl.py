#!/usr/bin/python
"""
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
"""
import sys, getopt

def main(argv):
	inputfile = ''
	outputfile = ''
	try:
		opts, args = getopt.getopt(argv,"hi:o:en",["ifile=","ofile="])
	except getopt.GetoptError:
		print 'ERROR'
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			print 'test.py -i <inputfile> -o <outputfile>'
			sys.exit()
		elif opt in ("-i", "--ifile"):
			f = open(str(arg))
		elif opt in ("-o", "--ofile"):
			o = open(str(arg), "w")
		elif opt == '-e':
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
		elif opt == '-n':
			while 1: 
				line = f.readline() 
				if not line: break 
				line = line.replace("url = {", 'howpublished = {\url{') 
				line = line.replace("urldate = {",'note = "[Online; geraadpleegd op ')
				if line[0:21] == 'howpublished = {\url{': 
					line = line[0:-3] 
					line = line + '}},\n' 
				if line[0:9] == 'note = "[':
					line = line[0:-3]
					line = line + ']"\n'
				o.write(line) 
	o.close() 
	f.close()
	print 'Input file is "', f
	print 'Output file is "', o

if __name__ == "__main__":
   main(sys.argv[1:])
