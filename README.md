# sCrypt CLI

A CLI tool to make development of sCrypt faster and easier.

[![Build Status](https://travis-ci.com/sCrypt-Inc/scrypt-cli.svg?branch=master)](https://travis-ci.com/sCrypt-Inc/scrypt-cli)
## Installation

```sh
npm install -g scrypt-cli
```

## Usage

### Create a new sCrypt smart contract project

```sh
scrypt project my-proj
```
 
 or simply

```sh
scrypt p my-proj
```

The command creates a new directory `my-proj` which contains a demo sCrypt smart contract along with needed scaffolding. 

Read the projects `README.md` for more info on how to test and deploy the generated smart contract.

You can also use the following command to generate a stateful smart contract project:

```sh
scrypt p --state my-proj
```

Lastly, you can create an sCrypt library project with the following option:

```sh
scrypt p --lib my-lib
```
### Compile sCrypt smart contracts

```sh
scrypt compile
```

This will search current project for classes extending `SmartContract` and compile them. This will produce a [contract artifact file](https://github.com/sCrypt-Inc/scryptlib#contract-description-file) for each compiled class. The files will be stored under the `scrypts` directory. 

The command needs to run in the root directory of the project.

### Publish project
```sh
scrypt publish
```

This will check the structure of the current project and publish it on NPM.

### Get system info

When filing an issue a lot of time it's useful to provide information about your system. You can get this information with the following command:

```sh
scrypt system
```

