function emptyFn() {
    return undefined;
}
function getSelect() {
    return select();
}

export function select() {
    return {
        attr: (x, y) => {
            if (y) {
                return getSelect;
            } else {
                return '';
            }
        },
        on: () => emptyFn,
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
