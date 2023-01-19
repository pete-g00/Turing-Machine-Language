# Meeting 09-12-22

As requested by Ornela, I sent her the status report and presented a demo of the website.

I went through the three parts of the project:

* Part 1- the documentation and the specification of TML. I have updated the dissertation structure based on the feedback by Ornela. This is considered complete.
* Part 2- the parser and the converter for TML- this is considered complete.
* Part 3- the website for TML- currently in construction and have just been choosing frameworks and experimenting the features with concrete examples for each feature (code editor, converter to TM and tape execution).

Ornela suggested that it would be good to also include the formal TM definition on the website- I have added that to the moscow and will look at it later; it should be a simple addition to make, but not a priority at this point.

After feedback from a peer, I realised that I could simplify the syntax of the TML- early on, I had figured out that just having while statements is not enough for equivalence of TMLs to TMs, so had introduced the concept of both if statements and switch blocks to remedy this (at 2 different times, not realising that I had already fixed the issue!). Removing the switch block makes the most sense and is easier to change as well, so that has been changed.
