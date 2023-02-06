// checks whether the given string is a palindrome, i.e. the string equals its reverse
alphabet = {a, b}
module palindrome {
    if blank {
        accept
    } 
    // starts with a => check ends with a
    if a {
        changeto blank
        move right
        // move to the end
        while a, b {
            move right
        } if blank {
            move left
            // cannot end with a b
            if b {
                reject
            } if a, blank {
                changeto blank
                move left
                goto restart
            }
        }
    }
    // starts with b => check ends with b
    if b {
        changeto blank
        move right
        // move to the end
        while a, b {
            move right
        } if blank {
            move left
            // cannot end with an a
            if a {
                reject
            } if b, blank {
                changeto blank
                move left
                goto restart
            }
        }
    }
}
// go to the start and restart
module restart {
    while a, b {
        move left
    } if blank {
        move right
        goto palindrome
    }
}