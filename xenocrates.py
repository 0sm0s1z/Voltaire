#!/usr/bin/python
import sqlite3 as sql
import sys
import operator

#Global Variables
tablename = "SANS560_index"
topic = []
definition = []
book = []
page = []
notes = []
reference = []
index = []

 
    
doc = open(sys.argv[1], "r")
for raw in doc.readlines():
    for datz in raw.split("\r"):
        data = "".join([i if ord(i) < 128 else ' ' for i in datz])
        topic.append(data.split("\t")[0])
        try:
            definition.append(data.split("\t")[1])
        except:
            pass
        try:
            page.append(data.split("\t")[2])
        except:
            pass
        try:
            book.append(data.split("\t")[3])
        except:
            pass

i = 0
for blah in topic:
    try:
        index.append([topic[i], book[i], page[i], definition[i]])
    except:
        pass
    i = i + 1

pos = 0
sorted_list = sorted(index, key=operator.itemgetter(0))
for item in sorted_list:
    key = item[0].strip('"').rstrip('"')
    #Create Section Header
    if key.startswith("A") or key.startswith("a"):
        if pos == 0:
            print "<span class = 'title'>Aa</span><br><br>"
            pos = 1
    elif key.startswith("B") or key.startswith("b"):
        if pos != 2:
            print "<span class = 'title'>Bb</span><br><br>"
            pos = 2
    elif key.startswith("C") or key.startswith("c"):
        if pos != 3:
            print "<span class = 'title'>Cc</span><br><br>"
            pos = 3
    elif key.startswith("D") or key.startswith("d"):
        if pos != 4:
            print "<span class = 'title'>Dd</span><br><br>"
            pos = 4
    elif key.startswith("E") or key.startswith("e"):
        if pos != 5:
            print "<span class = 'title'>Ee</span><br><br>"
            pos = 5
    elif key.startswith("F") or key.startswith("f"):
        if pos != 6:
            print "<span class = 'title'>Ff</span><br><br>"
            pos = 6
    elif key.startswith("G") or key.startswith("g"):
        if pos != 7:
            print "<span class = 'title'>Gg</span><br><br>"
            pos = 7
    elif key.startswith("H") or key.startswith("h"):
        if pos != 8:
            print "<span class = 'title'>Hh</span><br><br>"
            pos = 8
    elif key.startswith("I") or key.startswith("i"):
        if pos != 9:
            print "<span class = 'title'>Ii</span><br><br>"
            pos = 9
    elif key.startswith("J") or key.startswith("j"):
        if pos != 10:
            print "<span class = 'title'>Jj</span><br><br>"
            pos = 10
    elif key.startswith("K") or key.startswith("k"):
        if pos != 11:
            print "<span class = 'title'>Kk</span><br><br>"
            pos = 11
    elif key.startswith("L") or key.startswith("l"):
        if pos != 12:
            print "<span class = 'title'>Ll</span><br><br>"
            pos = 12
    elif key.startswith("M") or key.startswith("m"):
        if pos != 13:
            print "<span class = 'title'>Mm</span><br><br>"
            pos = 13
    elif key.startswith("N") or key.startswith("n"):
        if pos != 14:
            print "<span class = 'title'>Nn</span><br><br>"
            pos = 14
    elif key.startswith("O") or key.startswith("o"):
        if pos != 15:
            print "<span class = 'title'>Oo</span><br><br>"
            pos = 15
    elif key.startswith("P") or key.startswith("p"):
        if pos != 16:
            print "<span class = 'title'>Pp</span><br><br>"
            pos = 16
    elif key.startswith("Q") or key.startswith("q"):
        if pos != 17:
            print "<span class = 'title'>Qq</span><br><br>"
            pos = 17
    elif key.startswith("R") or key.startswith("r"):
        if pos != 18:
            print "<span class = 'title'>Rr</span><br><br>"
            pos = 18
    elif key.startswith("S") or key.startswith("s"):
        if pos != 19:
            print "<span class = 'title'>Ss</span><br><br>"
            pos = 19
    elif key.startswith("T") or key.startswith("t"):
        if pos != 20:
            print "<span class = 'title'>Tt</span><br><br>"
            pos = 20
    elif key.startswith("U") or key.startswith("u"):
        if pos != 21:
            print "<span class = 'title'>Uu</span><br><br>"
            pos = 21
    elif key.startswith("V") or key.startswith("v"):
        if pos != 22:
            print "<span class = 'title'>Vv</span><br><br>"
            pos = 22
    elif key.startswith("W") or key.startswith("w"):
        if pos != 23:
            print "<span class = 'title'>Ww</span><br><br>"
            pos = 23
    elif key.startswith("X") or key.startswith("x"):
        if pos != 24:
            print "<span class = 'title'>Xx</span><br><br>"
            pos = 24
    elif key.startswith("Y") or key.startswith("y"):
        if pos != 25:
            print "<span class = 'title'>Yy</span><br><br>"
            pos = 25
    elif key.startswith("Z") or key.startswith("z"):
        if pos != 26:
            print "<span class = 'title'>Zz</span><br><br>"
            pos = 26
            
            
            
    print "<style>.topic{color: blue;font-weight: bold;}</style>"        
    #Print Details
    if item[0] != "":
        print "<span class = 'topic'>%s</span> <i>[b%s/p%s]</i>  %s<br>" % (item[0].strip('"').rstrip('"'), item[1], item[2].strip('"').rstrip('"'), item[3])
        
#print sorted_list



