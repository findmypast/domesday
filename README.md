# domesday
[![npm](https://img.shields.io/npm/v/domesday.svg)](https://www.npmjs.com/package/usher-cli)

Generates UUIDs and registers them to given users in Hashicorp's Vault. Also adds a secret to the vault.

## Installation

`npm install -g domesday`

## Usage
### Create a password for an application

```
domesday userpass <host> <app-name> <policy> [-t --token <github personal access token>]
```

Generates a UUID and registers as the password for user `<app-name>` with policy `<policy>`. The `<host>` must contain credentials in the following format: `username:password@...`.

For example, to register and return a UUID to the user "myapp" and grant policy "application":

`$ domesday userpass http://user:password@127.0.0.1:8200 myapp application`

Note that the credentials are past as the host address. Alternatively, you can pass a Github personal access token to authenticate with the vault:

`$ domesday userpass http://127.0.0.1:8200 myapp application -t MY_SECRET_TOKEN`

### Add a secret to the vault

```
domesday add-key-value <host> <key> <value> [-t --token <github personal access token>]
```
This will add the specified key and value (value is text only at the moment - sorry!) to the vault:

For example:

```
domesday add-key-value http://127.0.0.1:8200 secret/path/to/my/secret my_secret_value -t MY_SECRET_TOKEN
```

Adds the value `my_secret_value` to the vault at the `secret/path/to/my/secret` path, authenticating with the specified Gitgub personal access token. Alternatively, pass the credentials in the host. e.g.:

```
domesday add-key-value http://user:password@127.0.0.1:8200 secret/path/to/my/secret my_secret_value
```
If credentials are passed in both the host URI and the `--token` option then the token is used.
