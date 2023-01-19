# Meeting 07-10-2022
As requested by Ornela, I sent her the agenda for the meeting. The two main pieces of work created over this week was the specification of a TML program, and the proof of equivalence (which is not complete yet)- I had also sent these documents to her. Her initial feedback (via teams) was that the specification looks good, and to add some examples of incorrect program(s). Also, she had warned me to not show equivalence with just examples- this is not a valid proof. I was aware of this, and had included a bunch of examples in the proof document, but I understand that this does not constitute a proof. The point of these examples is to motivate how we can use complete TML program to construct TMs, and vice versa. I shall be working on the proof next week- I believe it will involve induction (show that the tapehead behaves the same for TM and its corresponding TML program for every step in execution). The current aim is to show that:

- For every valid program, there exists a corresponding complete program
- For every complete program, there exists a corresponding TM
- For every TM, there exists a corresponding complete program

This should be enough to show that TMs and TMLs are equivalent.

Ornela also suggested that it would be good to link this to the Church-Turing Thesis. In particular, to incorporate the equivalence with lambda-calculus and explore other forms of equivalences as well. I think this is definitely something to consider, but I will focus on that later, perhaps after the specification and proof of equivalence is complete.

I also asked whether it would be reasonable for me to create MoSCoWs. I should have originally started with it, but I was too excited to work on the specification and did so first :) I'll try to create that for next week. I have already broken it down to subtasks, so it should just involve assigning different priorities to each subsection, perhaps breaking down each section. It might be good to also have 2 levels of MoSCoWs- one for a brief plan of the entire project, and one for each of the subplan.

Ornela was also wondering about the use of ANTLR to facilitate the proof of equivalence/for the website. I believe it would definitely be worth trying using ANTLR soon in Java, and creating a parser. But, currently, I am thinking of creating the parser myself- the language is quite simple and I'm not sure what frameworks are available in JavaScript/any language I could use. I think, for syntax highlightling in the website-to-be, I might need to still create a form of parser (even if it is not required for the actual parsing of the program) that supports the API. This can be decided later, but I'm definitely down to try using the EBNF to construct a grammar, and seeing how it works in Java!

Also, before fixing a framework, Ornela said it is very important to evaluate all the frameworks available. This should be independent of our knowledge about the language, but should be justified more for the purpose of the project- which framework would be better based on the APIs available, the flexibility, the extra work required, etc.

The next meeting will be on Friday 14th October.