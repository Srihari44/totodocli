# Todo CLI

**No external dependancies! Just run it anywhere!**

## Getting started

Only Node.js required. Then, you can directly run,

**On windows**

```
./todo.bat <command> <argument>
```

**On Unix**

```
./todo.sh <command> <argument>
```

However, Since tests require symbolic links to be created, create them accordingly.

**Command Prompt:**

```
> mklink todo todo.bat
```

**Powershell:**

```
> cmd /c mklink todo todo.bat
```

**On \*nix:**

Run the following command in your shell:

```
$ ln -s todo.sh todo
```

## Testing

Install Jest and you can very well test :)

```
npm install jest
npm test
```
