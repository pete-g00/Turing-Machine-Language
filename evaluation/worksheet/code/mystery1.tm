alphabet = {0, 1}
module mystery {
    while 0, 1 {
        move right
    } if blank {
        move left
        if blank, 0 {
            reject
        } if 1 {
            move left
            if blank, 1 {
                reject
            } if 0 {
                accept
            }
        }
    }
}