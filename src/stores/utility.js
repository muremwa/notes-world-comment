const cases = {
    HUNGARIAN_NOTATION: 'HN',
    NORMAL_CASE: 'NR',
    CAMEL_CASE: 'CS',
    SNAKE_CASE: 'SC',
};


/**
 * @param {string} toChange
 * @param {string} currentCase
 * @param {string} changeTo
 * @returns {string} Returns a string in the new case type
 */
function caseChanger (toChange, currentCase, changeTo) {
    if ([toChange, currentCase, changeTo].some((arg) => arg === undefined)) {
        throw new Error('Missing arguments');
    }

    if ([toChange, currentCase, changeTo].some((arg) => (typeof arg) !== 'string')) {
        throw new Error('Wrong argument type');
    }

    currentCase = currentCase.toUpperCase();
    changeTo = changeTo.toUpperCase();

    if (currentCase === changeTo) {
        return toChange;
    }

    let temp;
    let result;

    switch (currentCase) {
        case cases.CAMEL_CASE:
            temp = toChange.split(/([A-Z][a-z]*)/).filter(Boolean);
            break;

        case cases.HUNGARIAN_NOTATION:
            temp = toChange.split(/([A-Z][a-z]*)/).filter(Boolean);
            break;

        case cases.SNAKE_CASE:
            temp = toChange.split("_");
            break;

        case cases.NORMAL_CASE:
            temp = toChange.split(/\s/);
            break;

        default:
            throw new Error(`Converting from '${currentCase}' not supported`);
    }


    switch (changeTo) {
        case cases.CAMEL_CASE:
            result = temp.map((char) => `${char[0].toUpperCase()}${char.substring(1).toLowerCase()}`).join('');
            break;

        case cases.HUNGARIAN_NOTATION:
            result = temp.map((char, index) => {
                char = char.toLowerCase();
                if (index > 0) {
                    char = `${char[0].toUpperCase()}${char.substring(1).toLowerCase()}`;
                }

                return char
            }).join('');
            break;

        case cases.SNAKE_CASE:
            result = temp.map((char) => char.toLowerCase()).join('_');
            break;

        case cases.NORMAL_CASE:
            result = temp.map((char) => char.toLowerCase()).join(' ');
            break;

        default:
            throw new Error(`Converting to '${changeTo}' not supported`);
    }

    return result;
}

function cleaner (obj = {}) {
    /*
        clean generic data from the backend recursively!!!
    */
    const isObject = (item) => typeof item === 'object' && item !== null;

    if (!isObject(obj)) {
        return {};
    }

    // create a map to hold the results
    const objMap = new Map();

    // loop through all items and change case
    for (let [key, value] of Object.entries(obj)) {
        const newKey = caseChanger(key, cases.SNAKE_CASE, cases.HUNGARIAN_NOTATION);

        // recursively clean arrays and other objects
        if (Array.isArray(value)) {
            value = value.map(cleaner);
        } else if (isObject(value)) {
            value = cleaner(value);
        }
        objMap.set(newKey, value);
    }
    return Object.fromEntries(objMap);
}