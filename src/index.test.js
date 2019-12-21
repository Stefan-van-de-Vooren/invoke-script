const index = require('./index');
const path = require('path');

const makePathToModuleAbsolute = (relativePath) => {
    return path.join(path.resolve(), relativePath);
};

const getModule = (relativePath) => {
    return require(makePathToModuleAbsolute(relativePath));
};

const makeStringRed = (value) => `\x1b[31m${value}\x1b[0m`;

jest.doMock(
    makePathToModuleAbsolute('my-module'),
    () => ({
        default: jest.fn(),
        exportedFunction: jest.fn(),
        exportedFunctionWithArgs: jest.fn()
    }),
    {virtual: true},
);

jest.doMock(
    makePathToModuleAbsolute('my-module-function'),
    () => jest.fn(),
    {virtual: true},
);

jest.doMock(
    makePathToModuleAbsolute('my-module-without-default-function'),
    () => ({}),
    {virtual: true},
);

beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
});

describe('happy flow', () => {
    test('it should call the function returned by the module', () => {
        index('my-module-function');
        expect(getModule('my-module-function')).toHaveBeenCalled()
    });

    test('it should call the default exported function', () => {
        index('my-module');
        expect(getModule('my-module').default).toHaveBeenCalled()
    });

    test('it should call the exported function', () => {
        index('my-module#exportedFunction');
        expect(getModule('my-module').exportedFunction).toHaveBeenCalled()
    });

    test('it should call the exported function with arguments', () => {
        index('my-module#exportedFunctionWithArgs', 'foo', 'bar');
        expect(getModule('my-module').exportedFunctionWithArgs).toHaveBeenCalledWith('foo', 'bar')
    });
});

describe('unhappy flow', () => {
    test('it should exit the process when the default function does not exist', () => {
        const mockExit = jest.spyOn(process, 'exit').mockImplementationOnce(() => {});
        const consoleError = jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        try {
            // because we mocked the process.exit function, index now throws an error
            index('my-module-without-default-function');
        } catch (e) {}

        expect(mockExit).toHaveBeenCalledWith(1);
        expect(consoleError).toHaveBeenCalled();
    });

    test('it should exit the process when the exported function does not exist', () => {
        const mockExit = jest.spyOn(process, 'exit').mockImplementationOnce(() => {});
        const consoleError = jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        try {
            // because we mocked the process.exit function, index now throws an error
            index('my-module#notExcistingFunction');
        } catch (e) {}

        expect(mockExit).toHaveBeenCalledWith(1);
        expect(consoleError).toHaveBeenCalledWith(makeStringRed(`Could not invoke the function 'notExcistingFunction' on module 'my-module'\n`));
    });
});
