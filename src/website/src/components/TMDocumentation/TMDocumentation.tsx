import React, { useRef, useState } from 'react';
import { Divider } from '@mui/material';
import { Container } from '@mui/system';
import AppToolbar from '../Apptoolbar/Apptoolbar';
import Navigation from '../DocumentationNavigation/DocumentationNavigation';
import { MathComponent } from "mathjax-react";
import { getProgram } from '../MonacoConfig';
import { CodeConverter } from 'parser-tml';
import { code } from '../Editor/Editor';
import TapePanel from '../TapePanel/TapePanel';
import { DocumentationProps } from '../Documentation/Documentation';
import FSMPanel from '../FSMPanel/FSMPanel';

const _program = getProgram(code, [])!;
const converter = new CodeConverter(_program);
const turingMachine = converter.convert();

function TMDocumentation({userConfiguration}:DocumentationProps) {
    const navArray = [
        {name: "Documentation", link: "/documentation"},
        {name: "TM Documentation"}
    ];
    
    const program = useRef(_program);
    const [currentState, setCurrentState] = useState<string|undefined>('q0');
    const [currentEdge, setCurrentEdge] = useState<string|undefined>(undefined);

    return (
        <Container>
            <AppToolbar isDocumentation userConfiguration={userConfiguration}/>
            <Navigation navArray={navArray}></Navigation>
            <div className="content">
                <h1>Turing Machines</h1>
                <Divider/>
                <h2>Introduction to Turing Machines</h2>
                <p>Before defining Turing Machines formally, we will first see an illustration of a Turing Machine.</p>
                <figure>
                <div className='tm-fsm'>
                    <FSMPanel turingMachine={turingMachine} currentState={currentState} currentEdge={currentEdge}/>
                </div>
                    <figcaption>A Turing Machine that accepts binary numbers that divide 2. It is a directed graph where the vertices are called <i>states</i> and the edges <i>transitions</i>. This is a <i>finite state machine</i> representation of a Turing Machine.</figcaption>
                </figure>
                <p>A Turing Machine represents a program that takes a specific type of string, parses it letter by letter and returns true or false, depending on what the final state we end up at is. We maintain the current position on the tape and the current state on the Turing Machine during each step in execution. Formally, a Turing Machine is a tuple <MathComponent display={false} tex='(Q, \Sigma, \delta, q_0)' />, where:</p>
                <ul>
                    <li><MathComponent display={false} tex='Q'/> is the set of states in the Turing Machine. In the example above, we have <MathComponent display={false} tex='\{q_0, q_1, q_2\}'/>. In the example, there are two further states- the accept state <MathComponent display={false} tex='q_Y'/> and the reject state <MathComponent display={false} tex='q_N'/>. These can be added to the set <MathComponent display={false} tex='Q'/> to give the set of all the states <MathComponent display={false} tex='Q^+'/>.</li>
                    <li><MathComponent display={false} tex='\Sigma'/> is the set of alphabet. In the example above, we have <MathComponent display={false} tex='\Sigma = \{0, 1\}'/>. A tape can also have a blank value, which is denoted by <MathComponent display={false} tex='\#'/>, and the set <MathComponent display={false} tex='\Sigma^+'/> represents the set of alphabets include the blank symbol.</li>
                    <li><MathComponent display={false} tex='q_0 \in Q'/> is the initial state.</li>
                    <li><MathComponent display={false} tex='\delta \colon Q \times \Sigma^+ \to Q^+ \times \Sigma^+ \times \{L, R\}'/> is the transition function. The transition function takes into account the current state and the letter in the alphabet, and tells us what the next state is, what value we replace the current tape entry with, and whether we move to the left (L) or the right (R) on the tape. For instance, in the example above, we have <MathComponent display={false} tex='\delta(q_0, 0) = (q_1, \#, R)'/>, which means that the current value on the tape changes to blank; we move to the state <MathComponent display={false} tex='q_1'/>; and the current tape position is now to the right of the previous tape position. This is what the arrows in the Turing Machine state machine above represent- the arrow states which letter this transition from the given state applies to (the letter before the arrow), which state we end up at and what the current value becomes (the letter after the arrow).</li>
                </ul>
                Read more about Turing Machines in: wikipedia.

                <h2>Executing a Turing Machine on a tape</h2>
                Since Turing Machines represent programs, we want to run them on some input. This input is called a (Turing Machine) tape, which for our sake is an infinite sequence of letters in the alphabet <MathComponent display={false} tex='\Sigma^+'/>, including the blank symbol. For a tape to be valid, it should only have finitely many non-blank symbols, all of which are placed together (i.e. there are only non-blank entries between any two non-blank entries on the tape). During execution, we maintain a state of 2 objects- the current position on the tape and the current state on the Turing Machine. At the start, the current position is the first non-blank position on the tape, and the current state is the initial state <MathComponent display={false} tex='q_0'/>.
                <br />

                The panel below illustrates how a Turing Machine is executed on a valid tape. Enter a valid tape value (i.e. a binary number) to show the animation!
                <figure>
                    <TapePanel turingMachine={turingMachine} setCurrentEdge={setCurrentEdge} setCurrentState={setCurrentState} 
                        setIsTapeExecuting={() => undefined} program={program} />
                    <figcaption>A Turing Machine tape animation that shows how a Turing Machine executes on a tape. The current Turing Machine state is highlighted during execution, along with the arrow we chose.</figcaption>
                </figure>
            </div>
        </Container>
    );
}

export default TMDocumentation;