#Xenocrates
Xenocrates is an indexing tool for GIAC certification examinations. Creating an index with Xenocrates is a three phase process involving: documentation/note-taking, sorting & normalization, and word processing. This readme is meant to guide a user through this process. Alternatively, a YouTube walkthrough will be released shortly.

Video: http://youtube.com/mtoussain

*Provided by @0sm0s1z*


There are two separate python files provided herein: xenocrates.py & xenocrates-gse.py

The GIAC GSE examination covers material discussed in multiple courses and therefore requires an additional piece of information for proper indexing: Course Designation

##Indexing Methodology

1. Create an excel spreadsheet with the following columns: title, description, page, book (add a course column for GSE indexing)

2. Take notes from the course material. When I feel comfortable with the material I often annotate the location of certain information by filling in a title/page/book and providing a "." under description. This saves me study time while still allowing me to look up specifics related to a topic that I may have missed.

2.1. (Optional) Excel has some nice sort functions built in. Xenocrates does proform alphabetical sorting, but depending on some of the characters you may have used while taking notes it may sort certain things counter intuitively. Notes including things like the following could potentially cause an error: '"<script>#$! (xenocrates-gse.py includes an extra layer of data processing that solves many of these problems)

3. Save the document as a tab delimited file

4. Run the program:

python xenocrates.py <filename> > index.htm

5. Xenocrates has created an HTML file with the formated content of your index. Open this file in a web browser. Press CTRL + A to select all content. Copy and paste the information into a word processor.

6. Format the document according to your preferences
	- I set the document to use two columns
	- I double-sided print and therefore must have an even number of pages for each letter group in order to bind the index properly
	- I adjust formating of the letter headers to fit my preferences ie (Aa, Bb, Cc) -> I typically use the Microsoft Word preformated "Title" option.
	- I like to create a coversheet with the date, and course information

7. Print the document and take it to OfficeMax/Depot for binding.
	- I typically use a clear front and black backing; however, having a clear cover on each side can be handy if you bind a quick reference to the back of the index ie SANS packet header cheatsheet (what I used on my GSE index)


8. ???

9. Get Certs

10. Profit $$$

