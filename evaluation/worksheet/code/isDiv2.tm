// checks whether a binary number is divisible by 2
alphabet = {0, 1}
module isDiv2 {
    while 0, 1 {
        move right
    } if blank {
        move left
        if 0 {
            accept
        } if 1, blank {
            reject
        }
    }
}