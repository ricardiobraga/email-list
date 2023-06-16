const fs = require('fs');
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');


const csv = require('fast-csv');
let ws = fs.createWriteStream('./src/emailList/email-list.csv')






// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');



// SET EMAIL:


/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.promises.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.promises.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.promises.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */


const arrayId = [];
const newArray = [];
let counter = 0


function renderCsv(array) {
  csv.write(array, { headers: false }).pipe(ws);
  console.log("new: ", array);
}

async function getList(auth) {
  const gmail = google.gmail({ version: 'v1', auth });

  const res = await gmail.users.threads.list({
    userId: 'me',

    q: "tatuagem after:2022/01/01 before:2023/06/12",

    maxResults: 500

  })

  const msg = res.data.threads;

  if (!msg || msg.length === 0) {
    console.log('No msg found.');
    return;
  }
  msg.forEach((msg) => {
    arrayId.push(msg.id);
  });

  arrayId.forEach(e => {
    renderEmailList(e, gmail)

  })  
}




async function renderEmailList(id, gmail) {

  const msgContent = await gmail.users.threads.get({
    userId: 'me',
    id: id
  });
  
  if (counter >= arrayId.length -1){
    renderCsv(newArray);
    console.log("fim");
  }

  counter++;
  
  msgContent.data.messages[0].payload.headers.forEach((msg) => {


    if (msg.name === "From") {

      newArray.push([msg.value.substring(msg.value.indexOf("<") + 1, msg.value.indexOf(">"))]); 

    }
    

  });
}





authorize().then(getList).catch(console.error);
