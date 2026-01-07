const k8s = require('@kubernetes/client-node');
const log = require('./log');

let kc;
let k8sApi;

function isRunningInK8s() {
  return process.env.KUBERNETES_PORT ? true : false;
}

function init(context){
  kc = new k8s.KubeConfig();
  
  if (isRunningInK8s()) {
    kc.loadFromCluster();
  } else {
    kc.loadFromDefault();
    if (context) {
      kc.setCurrentContext(context);
    }
  }
  
  k8sApi = kc.makeApiClient(k8s.CoreV1Api);
}

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

async function hasSecret(appUser, environment) {
  try {
    const response = await k8sApi.listNamespacedSecret(environment);
    let secretExists = false;
    response.body.items.forEach(elem => {
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

async function createSecret(appUser, appPassword, environment) {
    let secretExists = await hasSecret(appUser, environment);
    if (secretExists === false) {
      try {
        const secretObject = generateSecretObject(appUser, appPassword);
        await k8sApi.createNamespacedSecret(environment, secretObject.body);
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
  init,
  createSecret,
  hasSecret,
}
