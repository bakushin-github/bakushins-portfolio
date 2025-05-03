// get-oauth-token.js

const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

const SCOPES = ["https://mail.google.com/"];
const CREDENTIALS_PATH = "./lib/config/credentials.json";

// 認証フロー開始
fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) return console.error("Error loading client secret file:", err);
  authorize(JSON.parse(content), getAccessToken);
});

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  callback(oAuth2Client);
}

function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("Authorize this app by visiting this url:\n", authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("\nEnter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      console.log("\n✅ Your OAuth tokens:");
      console.log(token);
    });
  });
}
