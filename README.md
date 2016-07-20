# domesday
Generates UUIDs and registers them to given users in Hashicorp's Vault

## Usage

To register and return a UUID to the user "myapp" and grant policy "application":

`$ domesday userpass http://user:password@127.0.0.1:8200 myapp application`
