# Invoke-script
This package helps you when you want to call an exported function from a NPM script.

[![Build Status](https://travis-ci.com/Stefan-van-de-Vooren/invoke-script.svg?branch=master)](https://travis-ci.com/Stefan-van-de-Vooren/invoke-script)
[![npm](https://img.shields.io/npm/v/invoke-script/latest)](https://www.npmjs.com/package/invoke-script)

##Motivation
With NPM and Yarn it is super easy to add scripts to you package to *start*, *build* or *test* your project. In the script you execute a cli command from another package or your own javascript file. For example:

**src/hello.js:**
```
const hello = (value) => {
    console.log(`hello ${world}`);
}
hello(process.argv[2])
```

**package.json:**
```
{
  "name": "my-beautifu-project",
  "version": "0.0.1",
  "scripts": {
    "hello": "./src/hello"
  },
```





When you type `$npm run hello`, the '*./src/hello.js*' program will be executed with the output: '*hello world*'. 

This works works perfectly fine, but when you want to write tests for your program you have a problem. Because the file '*./src/hello.js*' is a self-invoking program, it runs as soon as you import the file in your test.

For testing and reusability it would be better when we had exported the function *hello* and rewrite the file as:

**src/hello.js:**
```
module.exports = {
    hello: (value) => {
        console.log(`hello ${world}`);
    }
}
```

Now we can execute the program from the node script after we rewrite the '*hello*' NPM script in: 

`"hello": "node -e 'require(\"./src/hello\").test(\"world\")'"`

but with all the escaped quotes it soon becomes unreadable :(

  
The **invoke-script** package helps you to invoke your exported function from a NPM just simple and readable:

`"hello": "invoke-script ./src/hello#test world`


##usages
**src/my-script.js:**
```
module.exports = {
    default: () => console.log('default function')
    exportedFunction: () => console.log('exported function')
    exportedFunctionWithArgs: (arg1, arg2) => console.log(`exported function with args: ${arg1}, ${arg2}`)
};
```

**src/my-other-script.js:**
```
module.exports = () => console.log('default function');
```

**package.json:**
```
{
  "name": "my-beautifu-project",
  "version": "0.0.1",
  "scripts": {
    "default": "invoke-script ./src/my-script"
    "default-other-script": "invoke-script ./src/my-other-script"
    "exported-function": "invoke-script ./src/my-script#exportedFunction"
    "exported-functionWithArgs": "invoke-script ./src/my-script#exportedFunction bar foo"
  },
```

`$npm run default` ->default function

`$npm run default-other-script` ->default function

`$npm run exported-function` ->exported function

`$npm run exported-functionWithArgs bar foo` ->exported function with args: bar, foo

**Happy coding!**