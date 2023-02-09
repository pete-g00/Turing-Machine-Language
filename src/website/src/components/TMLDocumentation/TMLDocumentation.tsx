import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { Container } from '@mui/system';
import { Divider } from '@mui/material';
import AppToolbar from '../Apptoolbar/Apptoolbar';
import Navigation from '../DocumentationNavigation/DocumentationNavigation';
import TapePanel from '../TapePanel/TapePanel';
import { getProgram } from '../MonacoConfig';
import { CodeConverter } from 'parser-tml';
import { code } from '../Editor/Editor';
import { DocumentationProps } from '../Documentation/Documentation';

const program = getProgram(code, [])!;
const converter = new CodeConverter(program);
const turingMachine = converter.convert();

function TMLDocumentation({ userConfiguration }:DocumentationProps) {
    const navArray = [
        {name: "Documentation", link: "/documentation"},
        {name: "TML Documentation"}
    ];
    
    const divEl = useRef<HTMLDivElement>(null);
    const editor = useRef<monaco.editor.IStandaloneCodeEditor|null>(null);

    useEffect(() => {
        if (divEl.current) {
            editor.current = monaco.editor.create(divEl.current, {
                value: code,
                language: 'TMProgram',
                theme: 'dracula',
                automaticLayout: true,
                fontSize: 14,
                lineNumbers: "on",
                wordWrap: "on",
                scrollBeyondLastLine: false,
                tabSize: 2,
                detectIndentation: false,
                readOnly: true
            });
            divEl.current.style.setProperty("height", `${editor.current.getContentHeight()}px`);
        }
        return () => {
            if (editor.current) {
                editor.current.dispose();
            }
        };
    }, []);

    return (
        <Container>
            <AppToolbar isDocumentation userConfiguration={userConfiguration}/>
            <Navigation navArray={navArray} />
            <div className="content">
                <h1>Turing Machine Programs</h1>
                <Divider />
                <h2>Introduction to Turing Machine Language</h2>
                <p>Turing Machine Language is a programming language that behaves similarly to Turing Machines. In particular, it can be executed on a tape. Before considering the syntax in detail, we look at an example program:</p>
                <figure>
                    <div ref={divEl}></div>
                    <figcaption>A program in TML. It takes a binary number (i.e. 1s and 0s) and determines whether it is divisible by 2.</figcaption>
                </figure>
                A TML program is composed of the following:
                <ul>
                    <li>an alphabet, which is a set of letters;</li>
                    <li>one or more modules, which are composed of blocks, which are switch blocks (e.g. at lines 5-19 and lines 11-17) and basic blocks (e.g. at line 7, 9, 13 and 15);</li>
                    <li>a switch block contains if and while commands for each letter in the alphabet (and the blank symbol), with basic block for each case;</li>
                    <li>a basic block contains commands of the format, e.g. <code>move</code>, <code>accept</code>, <code>reject</code> and <code>changeto</code>.</li>
                </ul>
                To understand the syntax of TML programs in more detail, consider the error messages.

                <h2>Executing a Turing Machine Program on a Tape</h2>
                A TML program can be executed on a tape. A valid tape is an infinite sequence of letters from the alphabet of the program, along with the blank symbol. For a tape to be valid, it should only have finitely many non-blank symbols, all of which are placed together (i.e. there are only non-blank entries between any two non-blank entries on the tape). During execution, we maintain a state of 2 objects- the current position on the tape and the current block on the TML program. At the start, the current position is the first non-blank position on the tape, and the current block is the first block in the first module. For a switch module, we choose the basic block corresponding to the current character.
                <br />

                The panel below illustrates how a Turing Machine is executed on a valid tape. Enter a valid tape value (i.e. a binary number) to show the animation!
                <figure>
                    <TapePanel program={program} setCurrentEdge={() => undefined} setCurrentState={() => undefined} 
                        setExecutingPositions={() => undefined} setIsTapeExecuting={() => undefined} turingMachine={turingMachine} />
                    <figcaption>A Turing Machine tape animation that shows how a Turing Machine executes on a tape. The current Turing Machine block is highlighted during execution.</figcaption>
                </figure>
            </div>
        </Container>
    );
}

export default TMLDocumentation;