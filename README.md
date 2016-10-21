# domesday
Generates UUIDs and registers them to given users in Hashicorp's Vault

## Installation

`npm install -g domesday`

## Usage

```
domesday AUTH_METHOD CONSUL_URL USERNAME POLICY
```

For example, to register and return a UUID to the user "myapp" and grant policy "application":

`$ domesday userpass http://user:password@127.0.0.1:8200 myapp application`
