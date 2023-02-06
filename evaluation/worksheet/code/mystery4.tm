alphabet = {a, b}
module q0 {
    if blank {
        move right
        accept
    } if a {
        changeto blank
        move right
        goto q1
    } if b {
        changeto blank
        move right
        goto q4
    }
}
module q1 {
    while a, b {
        move right
    } if blank {
        move left
        goto q2
    }
}
module q2 {
    if a, blank {
        move right
        reject
    } if b {
        changeto blank
        move left
        goto q3
    }
}
module q3 {
    if a, blank {
        move right
        reject
    } if b {
        changeto blank
        move left
        goto q7
    }
}
module q4 {
    while a, b {
        move right
    } if blank {
        move left
        goto q5
    }
}
module q5 {
    if a {
        changeto blank
        move left
        goto q6
    } if b, blank {
        move right
        reject
    }
}
module q6 {
    if a {
        changeto blank
        move left
        goto q7
    } if b, blank {
        move right
        reject
    }
}
module q7 {
    while a, b {
        move left
    } if blank {
        move right
        goto q0
    }
}