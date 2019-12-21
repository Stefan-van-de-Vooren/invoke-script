const path = require('path');

const makePathToScriptAbsolute = (input) => {
    if (path.isAbsolute(input)) {
        return input;
    }
    return path.join(path.resolve(), input);
};

const invokeFunction = (fn, args) => fn.apply(null, args);

const isFunction = (functionToCheck) => !!(functionToCheck && {}.toString.call(functionToCheck) === '[object Function]');

const makeStringRed = (value) => `\x1b[31m${value}\x1b[0m`;

const assert = (value, message) => {
    if (!value) {
        console.error(makeStringRed(message));
        process.exit(1);
    }
};


module.exports = (script, ...args) => {
    const [pathToScript, fn] = script.split('#');
    const module  = require(makePathToScriptAbsolute(pathToScript));

    if(fn) {
        assert(isFunction(module[fn]), `Could not invoke the function '${fn}' on module '${pathToScript}'\n`);
        invokeFunction(module[fn], args);
    } else if (isFunction(module.default)) {
        invokeFunction(module.default, args);
    } else {
        assert(isFunction(module), `Could not invoke the default function on module '${pathToScript}'.\nThe module does not export a default function.\n`);
        invokeFunction(module, args);
    }
};
