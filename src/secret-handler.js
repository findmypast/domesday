const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
const log = require('./log');

const client = new Client({ config: config.fromKubeconfig(), version: '1.9' });

function generateSecretObject(appUser, appPassword) {

  const base64AppUser = convertToBase64(appUser);
  const base64AppPassword = convertToBase64(appPassword);

  return {
    body:
    {
      "metadata":
        {
          "name": appUser
        },
      "data":
        {
          "username": base64AppUser,
          "password": base64AppPassword
        }
    }
  }
}

function convertToBase64(plaintext){
  return Buffer.from(plaintext).toString('base64');
}

async function hasSecret(appUser) {
  try {
    let secrets = await client.apis.v1.namespaces('default').secrets.get();
    let secretExists = false;
    secrets.body.items.forEach(elem => {
      if(elem.metadata.name === appUser){
        secretExists = true;
      }
    })
    return secretExists;
  }
  catch (err) {
    log.out(`Error retrieving secrets from the cluster ${err}`);
  }
}

async function createSecret(appUser, appPassword) {
    let secretExists = await hasSecret(appUser);
    if (secretExists === false) {
      try {
        await client.apis.v1.namespaces('default').secrets.post(generateSecretObject(appUser, appPassword));
        log.out(`Password for ${appUser} created`);
      }
      catch (err) {
        log.out(`Error creating secrets: ${err}`);
      }
    }
    else if (secretExists) {
      log.out(`Password for ${appUser} already exists`);
    }
}

module.exports = {
  createSecret: createSecret,
  hasSecret: hasSecret,
}
