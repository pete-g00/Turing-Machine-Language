alphabet = {a, b}
module mystery {
    if blank {
        accept
    } if a {
        changeto blank
        move right
        while a, b {
            move right
        } if blank {
            move left
            if a {
                reject
            } if b, blank {
                changeto blank
                move left
                while a, b {
                    move left
                } if blank {
                    move right
                    goto mystery
                }
            }
        }
    } if b {
        changeto blank
        move right
        while a, b {
            move right
        } if blank {
            move left
            if b {
                reject
            } if a, blank {
                changeto blank
                move left
                while a, b {
                    move left
                } if blank {
                    move right
                    goto mystery
                }
            }
        }
    }
}