alphabet = {0, 1}
module q0 {
    if blank {
        move right
        accept
    } while 0 {
        move right
    } if 1 {
        move right
        goto q1
    }
}
module q1 {
    if blank {
        move right
        reject
    } if 0 {
        move right
        goto q2
    } if 1 {
        move right
        goto q0
    }
}
module q2 {
    if blank {
        move right
        reject
    } if 0 {
        move right
        goto q1
    } while 1 {
        move right
    }
}