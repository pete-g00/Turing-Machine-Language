import React, { useState }  from 'react';
import { Box, Button, TextField } from '@mui/material';

interface TapeInputProps {
    setTape:(value:string) => void;
    goToTapeScreen:() => void;
    alphabet?:Set<string>;
    tape:string;
}


function TapeInput({goToTapeScreen, tape, setTape, alphabet}:TapeInputProps) {
    const [hasError, setHasError] = useState(false);

    function handleSubmit() {
        let errorState = false;
        for (let i = 0; i < tape.length; i++) {
            if (tape[i] !== " " && !alphabet!.has(tape[i])) {
                errorState = true;
            }            
        }

        setHasError(errorState);

        if (!errorState) {
            goToTapeScreen();
        }
    }

    return (
        <form>
            <Box textAlign='center'>
                <div>
                    <TextField 
                        variant='outlined' label='Tape Value' error={hasError} helperText={hasError ? 'Invalid Tape Value' : ' '}
                        onChange={(e) => setTape(e.target.value)} disabled={alphabet === undefined} value={tape}/>
                </div>
                <div>
                    <Button variant='contained' onClick={handleSubmit} disabled={alphabet === undefined}>Execute</Button>
                </div>
            </Box>
        </form>
    );
}

export default TapeInput;