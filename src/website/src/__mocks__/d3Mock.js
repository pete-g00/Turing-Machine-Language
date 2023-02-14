function emptyFn() {
    return undefined;
}

export function select() {
    return {
        attr: select,
        on: () => emptyFn,
        node: () => {
            return {
                transform: {
                    baseVal: []
                }
            };
        },
        transition: () => {
            return {
                duration: select
            };
        },
        selectAll: select,
        select,
    };
}

function getDrag() {
    return drag();
}

export function drag() {
    return {
        subject: getDrag,
        on: () => emptyFn,
    };
}
