import React, { useState }  from 'react';
import { Box, Button, TextField } from '@mui/material';

interface TapeInputProps {
    setTape:(value:string) => void;
    goToTapeScreen:() => void;
    alphabet:Set<string>|undefined;
    tape:string;
}


function TapeInput({goToTapeScreen, tape, setTape, alphabet}:TapeInputProps) {
    const [hasError, setHasError] = useState(false);

    function handleSubmit() {
        if (alphabet) {
            let errorState = false;
            for (let i = 0; i < tape.length; i++) {
                if (tape[i] !== " " && !alphabet.has(tape[i])) {
                    errorState = true;
                }
            }
    
            setHasError(errorState);
    
            if (!errorState) {
                goToTapeScreen();
            }
        }
    }

    function handleKeyDown(e:React.KeyboardEvent<HTMLFormElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    }

    return (
        <form onKeyDown={handleKeyDown}>
            <Box textAlign='center'>
                <div>
                    <TextField autoComplete='off'variant='outlined' label='Tape Value' error={hasError} 
                        helperText={hasError ? 'Invalid Tape Value' : ' '} onChange={(e) => setTape(e.target.value)} 
                        disabled={alphabet === undefined} value={tape}/>
                </div>
                <div>
                    <Button variant='contained' onClick={handleSubmit} disabled={alphabet === undefined}>Execute</Button>
                </div>
            </Box>
        </form>
    );
}

export default TapeInput;