# Log Reader Script Project

Project to supply the need of reading long log files, with filters by expression and date time.

# Necessary Technology Versions

Technology    | Version
------------- | -------------
Node          | v20.17.0
npm           | 10.8.2

# Configurations Building and Testing

To properly use this script first, you need to install its dependecies, by running the following
command:

```
$ npm install
```
Due to the simplicity of this script, and the short time to delivery it, the tests
have been skiped, all though its purpose is still valid and known as an important task.

# Running

To run this project it's needed to run the following command in the same terminal or command line interface of your preference, in the root of this project:

```
$ node index.js help
```

the parameters orders is:

 - file (required): string containing the path of the file to be read;
 - date (optional): string containing the date in order to filter by date;
 - time (optional): string containing the time in order to filter by time;
 - expression (required): string containing the expression in order to filter by expression.

# Usage with parameters example

```
$ node index.js --file='caminho_para_o_arquivo.xlsx' --date='2024-10-04' --time='12:01' --expression='minha_expressão'

```

or without optional parameters:

```
$ node script.js --file='caminho_para_o_arquivo.xlsx' --expression='minha_expressão'
```