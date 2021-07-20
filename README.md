# domesday
[![npm](https://img.shields.io/npm/v/domesday.svg)](https://www.npmjs.com/package/domesday)

Generates UUIDs and registers them to given users in Hashicorp's Vault. Also adds a secret to the vault.

## Installation

`npm install -g domesday`

## Usage

### Authentication

The credentials are past as the host address:

`$ domesday userpass http://user:password@127.0.0.1:8200 myapp application`

Alternatively, you can pass a Github personal access token to authenticate with the vault:

`$ domesday userpass http://127.0.0.1:8200 myapp application -t MY_SECRET_TOKEN`

If neither of these are set domesday will look for a github personal access token in:

- The `VAULT_GITHUB_TOKEN` environment variable
- The `vault_github_token` npm config variable, which you can set via `npm config set vault_github_token=MY_SECRET_TOKEN`

### Create a password for an application

```
domesday userpass <host> <app-name> <policy> [-t --token <github personal access token>]
```

Generates a UUID and registers as the password for user `<app-name>` with policy `<policy>`. The `<host>` must contain credentials in the following format: `username:password@...`.

For example, to register and return a UUID to the user "myapp" and grant policy "application":

`$ domesday userpass http://user:password@127.0.0.1:8200 myapp application`


### Add a secret to the vault

```
domesday add-key-value <host> <key> <value> [-t --token <github personal access token>]
```

This will add the specified key and value (value is text only at the moment - sorry!) to the vault.

For example:

```
domesday add-key-value http://127.0.0.1:8200 secret/path/to/my/secret my_secret_value
```

### Retrieve a secret from vault

```
domesday read-key-value <host> <key> [-t --token <github personal access token>]
```

This will read the specified key from the vault, outputting to stdout.

For example:

```
domesday read-key-value http://127.0.0.1:8200 secret/path/to/my/secret
```

### Generate a token in the vault

```
domesday token <host> [-t --token <github personal access token>] [-p --period <token period>]
```

This will generate a new access token in the vault with the caller's policies and permissions.

This token can be a [periodic token](https://www.vaultproject.io/docs/concepts/tokens#periodic-tokens) too.

For example:

```
domesday token http://127.0.0.1:8200 -p "2h"
```