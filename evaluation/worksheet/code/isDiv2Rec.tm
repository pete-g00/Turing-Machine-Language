// checks whether a binary number is divisible by 2 recursively
alphabet = {0, 1}
module isDiv2Rec {
    if 0, 1 {
        move right
        goto isDiv2Rec
    } if blank {
        move left
        if 0 {
            accept
        } if 1, blank {
            reject
        }
    }
}