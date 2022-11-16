# Week 6-7 Agenda

## Work Completed This Week
* Created tests to validate the converting TM program to a TM
* Created the class representation for TM tape

## Work to Complete Next Week
* Create the executor for TM program on a tape
* Improve the code- use more flexible visitor classes so that all the methods that do nothing 
* (Possibly?) Create the executor for TM on a tape

## Questions
* I'm thinking of making the visitor classes more flexible- I'm planning to remove the base visitor so that the visitor patterns being used for validate/parse are only created for those methods that are used (e.g. validate currently doesn't matter on the move command so it never gets called). Do you think this is a good idea?
