# Timelog

* Turing Machine Program
* Pete Gautam
* 2481471G
* Ornela Dardha

## Guidance

* This file contains the time log for your project. It will be submitted along with your final dissertation.
* **YOU MUST KEEP THIS UP TO DATE AND UNDER VERSION CONTROL.**
* This timelog should be filled out honestly, regularly (daily) and accurately. It is for *your* benefit.
* Follow the structure provided, grouping time by weeks.  Quantise time to the half hour.

## Week 2

### 27 Sep 2022

* *0.5 hours* Downloaded the template for the project and removed unnecessary files.
* *0.5 hours* Created GitHub repository using the template.

### 28 Sep 2022

* *0.5 hours* Formulated a brief plan for the entire project.

### 30 Sep 2022

* *1 hour* Initial meeting with Ornela.

## Week 3

### 04 Oct 2022
* *1.5 hours* Started working on the specification for the TM language. Added EBNF to the document and general rules.
* *1.5 hours* Added execution of a TML program on a valid tape.

### 05 Oct 2022
* *1 hour* Added an example of an execution of a valid tape on a TML program.
* *1.5 hours* Started working on the proof of equivalence document. Defined complete programs and added examples/illustrations.
* *0.5 hours* Added plans for week 4 and agenda for the week 3 meeting with Ornela.

### 07 Oct 2022

* *1 hour* Weekly meeting with Ornela.

## Week 4

### 11 Oct 2022

* *2 hours* Continued the proof of equivalence- showed that for every complete TML program, there is a corresponding TM (and vice versa).
* *2 hours* Finished the proof of equivalence- showed that for every valid TML program, there is a complete TML program.

### 12 Oct 2022

* *1.5 hours* Added examples of: converting a TM program into a TM, and converting a TM into a TM program.
* *0.5 hours* Created the MoSCoWs for the project.
* *0.5 hours* Added plans for week 5 and agenda for the week 4 meeting with Ornela.

### 14 Oct 2022

* *1 hour* Weekly meeting with Ornela.

## Week 5

### 18 Oct 2022

* *0.5 hours* Updated MoSCoWs with Part II stuff.
* *1.5 hour* Updated the documents- combined the proof and specification to documentation; changed some parts based on review/feedback from Ornela (e.g. added an invalid program in the spec).
* *0.5 hours* Started working on the parser- set up typescript and completed `CodePosition`- the class to determine the position within code.
* *0.5 hours* Set up CI/CD with linting

### 19 Oct 2022

* *2 hour* Completed the class `CodeWrapper`- a wrapper for code that essentially tokenises every word in a TM program.
* *0.5 hours* Researched creating tests using jest for typescript.
* *1 hour* Created tests for the class `CodeWrapper` and `CodePosition`.
* *0.5 hours* Added plans for week 6 and agenda for week 5 

## Week 6

### 25 Oct 2022

* *1 hour* Created the classes `Context`- a family of classes to save relevant data relating to different commands.
* *0.5 hours* Created the class `BaseVisitor`- an abstract visitor to visit all the types of commands in a TM program.
* *0.5 hours* Updated the class `Context` with visit methods.
* *1 hour* Started working on the class `CodeParser`- the parser of a raw TM program into a `ProgramContext` using `BaseVisitor`. 
* *0.5 hours* Weekly meeting with Ornela.

### 26 Oct 2022

* *4 hours* Changed the documentation- moved all the content to the dissertation, and changed the document based on initial feedback from Ornela.

