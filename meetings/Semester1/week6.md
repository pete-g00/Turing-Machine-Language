# Meeting 25-10-2022
As requested by Ornela, I sent her the agenda for this meeting. I had sent her the most recent version of the documentation, which combines the TML specification and proof of equivalence, and the moscow- at this point, the second part has been completed.

I had gotten some feedback on the documentation before the meeting, which we went through in detail. Ornela believes that the content is mostly well-written, but would like the following to be changed:

* the document should be clearer and more detailed- it is hard to follow all the content. I think it would also be better to add more intuition to it as well.
* the document should have fewer definitions/concepts- it is easily possible to combine many of the results.
* the order of the content should be changed- starting with the TM (which the reader is assumed to be familiar with), the TML syntax, definition of valid TM, equivalence of valid TM and complete TM (after which we assume that a program is complete), and then proof of equivalence between TMs and TMLs.

I will aim to improve the documentation tomorrow; at this point, my focus should be more on the parser so the amount of time I give to the specification will decrease over time. 

We also briefly went over the current state of the parser. I have created some classes to help parse the TML, such as `BaseVisitor` and `CodeParser`. Ornela thinks this is a good approach and believes I should continue in this manner. 

Our next meeting will be next Wednesday at 2. Ornela would like a progress report for the entire project as part of the agenda.