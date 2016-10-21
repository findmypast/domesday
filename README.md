# domesday
[![npm](https://img.shields.io/npm/v/domesday.svg)](https://www.npmjs.com/package/usher-cli)

Generates UUIDs and registers them to given users in Hashicorp's Vault

## Installation

`npm install -g domesday`

## Usage

```
domesday userpass <host> <app-name> <policy>
```

Generates a UUID and registers as the password for user `<app-name>` with policy `<policy>`. The `<host>` must contain credentials in the following format: `username:password@...`.


For example, to register and return a UUID to the user "myapp" and grant policy "application":

`$ domesday userpass http://user:password@127.0.0.1:8200 myapp application`
