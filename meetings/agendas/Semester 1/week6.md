# Week 5 Agenda

## Work Completed This Week
- Re-organised the documentation content:
    * moved to the dissertation (is background the right section?); 
    * changed the order as you proposed; 
    * avoided definition/remark idea and changed to example-then-definition approach which should be easier to follow (not the way you had wanted, but let me know if you like this or if I should go back to the previous format, but with labels).
- Continued working on the parser:
    * Added tests for the parser (both to test valid programs and invalid programs)
    * Created a validator (to ensure that a TML program is valid)- I feel like the Visitor approach isn't giving me flexibility (e.g. some of the methods in the Code Validator aren't called but need to be defined because of the Visitor class); will let this be for now and come back later- still does the job

## Work To Complete Next Week
- Continue on working on the parser:
    * Add tests for validation
    * Start working on code execution on tape

## Questions
- The documentation in dissertation:
    * is the documentation the right place for it to be placed?
    * is it easier to follow now? does it flow better?
    * I like the example-then-definition approach and I think it makes the concepts easier to grasp, but some of the examples take up a lot of space. Some of the examples might get moved to the appendix.
    * When creating the tests for `CodeParser`, I have come up with a ton of syntax errors- should I add these to the appendix with some programs and avoid putting incorrect programs in the background section? I'll have more next week when I have to think of tests for validation.
- I think I'm doing fine with the parser- you can have a look at the tests/code in the repo (https://github.com/pete-g00/Turing-Machine-Language/tree/main/src/tml-parser).