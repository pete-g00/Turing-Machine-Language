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

## Week 7

### 1 Nov 2022

* *1 hour* Started writing tests for `CodeParser`- testing the parsing errors.
* *1.5 hours* Finished tests for `CodeParser`- testing the correctly parsed context.
* *1 hour* Started the class `CodeValidator`.
* *0.5 hours* Added the agenda for the meeting- tomorrow's meeting has been cancelled.

### 2 Nov 2022

* *1 hour* Continued the class `CodeValidator`- more things to validate.
* *1 hour* Created tests for `CodeValidator`.
* *1 hour* Fixed some bugs in `CodeParser` (getting the error position correctly, changing blank to the empty string)

## Week 8

### 8 Nov 2022

* *0.5 hours* Created the classes `TMState`- a family of classes to represent Turing machine states.
* *0.5 hours* Created the class `TuringMachine`- a class to represent Turing machine.
* *1 hour* Created tests for `TMState` and `TuringMachine`.

### 9 Nov 2022

* *2 hours* Created the class `CodeConverter`- converts a TM program into a TM.
* *0.5 hours* Added the agenda for the meeting.

### 11 Nov 2022

* *1 hour* Weekly meeting with Ornela 

## Week 9

### 15 Nov 2022
* *2 hours* Created tests for `CodeConverter`.

### 16 Nov 2022

* *0.5 hours* Created the class `TMTape`- a class to represent TM tapes.
* *0.5 hours* Created tests for `TMTape`.
* *0.5 hours* Added the agenda for the meeting.

### 18 Nov 2022

* *1 hour* Weekly meeting with Ornela.

## Week 10

### 22 Nov 2022

* *1.5 hours* Created the class `TMExecutor`- a class to execute a tape on some TM, one step at a time.
* *1.5 hours* Created tests for `TMExecutor`.
* *0.5 hours* Added more documentation comments to the typescript files.
* *1 hour* Added comment parsing

### 23 Nov 2022

* *1.5 hours* Created the class `CodeExecutor`- a class to execute a tape on some TM program, one step at a time.
* *1 hour* Created tests for `CodeExecutor`.
* *1 hour* Added the class `CodeError` for errors in code and changed the tests/syntax for parser errors
* *0.5 hours* Added agenda for this week's work.

## Week 11

### 29 Nov 2022

* *1.5 hours* Made use of the pedantic linter.
* *1.5 hours* Updated the visitor methods- Part II is completed now!

### 30 Nov 2022

* *0.5 hours* Reorganised the dissertation.
* *1.5 hours* Added incorrect programs.
* *0.5 hours* Expanded the MoSCoW for Part 3.
* *0.5 hours* Added agenda for this week's work.

## Week 12 (Crunch Period)

### 05 Dec 2022 

* *0.5 hours* Planned Part 3- created a prototype diagram for the editor.
* *1 hour* Initialised a react project (with javascript) and tried designing the website (added toolbar).
* *1.5 hour* Initialised a webpack project and tried designing the website- more flexible, but challenging to get the basic set up (using `material.io`), so will just use the react project.
* *0.5 hours* Changed from a react project from javascript to typescript.
* *0.5 hours* Added linter/deploy to gh-pages.


### 06 Dec 2022

* *1 hour* added monaco editor to the website, and added the language TM Program and its keywords.
* *1 hour* added tokens for TM Program.
* *1 hour* set up dark theme on the editor using the dracula theme.
* *0.5 hours* set up autocompletion for the editor
