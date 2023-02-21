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

### 07 Dec 2022

* *0.5 hours* created the logo and added it to the website.
* *1.5 hours* researched the package `d3` and drawing shapes.
* *1 hour* added circles/texts to the website for Turing Machine.
* *1 hour* added arrows to the website for Turing Machine.

### 08 Dec 2022

* *0.5 hours* researched dragging in `d3`.
* *1 hour* experimented with `d3.drag`.
* *1.5 hours* added dragging of circles and text within it.
* *1 hour* changed dragging of circles to move arrows with them.
* *0.5 hours* added mock for `d3`.
* *0.5 hours* added the status report.

### 09 Dec 2022

* *2 hours* Meeting with Ornela
* *2 hours* Changed the syntax of TML to remove `switch tapehead`.

## Week 13 (Crunch Period)

### 12 Dec 2022

* *1.5 hours* added tape drawing- a tape entry and the tapehead pointer.
* *1 hour* experimented with `d3.transform`.
* *1.5 hour* used `d3.transform` to allow the tape to move right with a click.

### 13 Dec 2022

* *1 hour* researched routing in react.
* *1 hour* created documentation page and added routing to the website.
* *0.5 hours* researched testing in react.
* *0.5 hours* added tests for the toolbar.

### 14 Dec 2022

* *0.5 hours* Fixed logo not showing.
* *0.5 hours* Fixed issue with url.
* *0.5 hours* added more pages to the the website.
* *1 hour* created the error pages
* *1 hour* used JSON to create specific error pages

### 15 Dec 2022

* *1.5 hours* published the tml-parser package as parser-tml.
* *1 hour* imported the package into the website and added the code parser ability to show markers.
* *0.5 hours* tried to add links within error messages to the error pages in documentation- doesn't seem like there is support for this :(
* *1 hour* copied code from `CodeParser` and `CodeValidator` as examples for code errors.
* *0.5 hours* amended the error documentation page to include the code examples.

### 16 Dec 2022

* *0.5 hours* wrote and sent this week's update to Ornela
* *1.5 hour* Researched how to make the arrows in the Turing machine move more naturally as we drag the states- found the function `Math.atan2`.
* *1 hour* Added code to drag the arrows naturally as the states get dragged.
* *0.5 hours* Added text to arrows- need to develop how the text is displayed.
* *1 hour* Added support for loops- arrows from a state back to itself.

## Week 1 

### 10 Jan 2023

* *1 hour* Added a label to each `TMState` so that this value can be displayed on the website and changed other relevant code.
* *1.5 hours* Made use of the TM program on the editor to create the TM on the screen- currently updates every time there is a change in code.

## 11 Jan 2023

* *1 hour* Made some of the TM program on the editor so that it updates after clicking the button- currently only works when clicking it the first time and as long as we don't make major changes to code (introducing/removing pre-existing states); need to refactor the code from the d3 standard being used to the react standard
* *0.5 hours* Refactored `TMPanel` code involving `d3` into functions for dragging different components.
* *1 hour* Refactored `TMPanel` code using states in react to follow react standard- currently dragging states changes its coordinate temporarily (when we drag another state, it goes back to its original position).
* *1 hour* Researched how a component in React can receive data both from the parent component and the child component- use setState in the parent component and pass it to both components.
* *1 hour* Refactored code so that we can drag states with expected position.

## Week 2

### 16 Jan 2023

* *0.5 hours* Moved some code from Homepage to TMPanel
* *1.5 hours* Added the ability to step on TapePanel- currently just randomly steps to the left or the right, with equal probability.

### 17 Jan 2023

* *1.5 hours* Connected `TapePanel` with the step functionality created- currently only works when moving the first time; `CodeExecutor` seems to be treated as an immutable object.
* *0.5 hours* Fixed `TapePanel` execution using refs.

### 18 Jan 2023

* *0.5 hours* Added agenda for tomorrow's meeting.

### 19 Jan 2023

* *1 hour* Meeting with Ornela

## Week 3

### 23 Jan 2023

* *0.5 hours* Improved layout of documentation pages.
* *1 hour* Updated documentation pages content with real content (except for `PreciseErrorDocumentation`).
* *1 hour* Added `PreciseErrorDocumentation`.

### 24 Jan 2023

* *0.5 hours* Added more editor themes.
* *1.5 hours* Added drawer to change editor themes, font size and show/hide line numbers.
* *0.5 hours* Created a plan for the evaluation stage.

### 26 Jan 2023

* *1 hour* Meeting with Ornela

## Week 4

### 30 Jan 2023

* *1.5 hours* Added specification for TM
* *1 hour* Added specification for TML

### 31 Jan 2023

* *1.5 hours* Created the evaluation worksheet- still need to complete Part 3 but is mostly done

### 1 Feb 2023

* *0.5 hours* Completed the evaluation worksheet
* *0.5 hours* Added the agenda for tomorrow's meeting

### 2 Feb 2023

* *1 hour* Meeting with Ornela

## Week 5

### 6 Feb 2023

* *2.5 hours* Changed FSM using Graphviz for better presentation

### 7 Feb 2023

* *0.5 hours* Showed code execution in Tape- a verbose description of execution given
* *1 hour* Showed code execution in TM code- highlight the current state and current edge 
* *1 hour* Created the evaluation survey

### 8 Feb 2023

* *1 hour* Fixed a bug in editor
* *0.5 hours* Added agenda for the meeting

### 9 Feb 2023

* *1 hour* Weekly meeting with Ornela
* *1 hour* Showed code execution in Editor- highlight the basic block being executed
 
### 10 Feb 2023

* *2 hours* Evaluation Sessions
* *1 hour* Fixed many minor bugs noticed during the evaluation

## Week 6

### 13 Feb 2023

* *0.5 hours* Added transition time user configuration
* *1 hour* Added Definition TM Panel 

### 14 Feb 2023

* *0.5 hours* Add examples, but only the ones not given in the worksheet- isDiv2, isDiv2Recursive, aNbN
* *2 hours* Added react tests 

### 16 Feb 2023

* *1 hour* Evaluation Session
* *1 hour* Meeting with Ornela

### 17 Feb 2023

* *2 hours* Evaluation Sessions

## Week 7

### 20 Feb 2023
* *0.5 hours* Updated examples so it matches with evaluation exercises
* *0.5 hours* Some minor tweaks to the website (changing opacity of accept/reject state if it is current state so it is easier to see the difference)

### 21 Feb 2023

* *1 hour* Completed requirements section of the dissertation- moved stuff from the moscows and expanded the points