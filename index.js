
var http = require('http');
var express = require('express');
var { RtcTokenBuilder, RtcRole } = require('agora-access-token')

var PORT = 8080;

var appID = "4f6055507f17439295f404d8b2dd0c19";
var appCertificate = "d2713813c4bb4b09b6dcff1bd4c270d6";
var expirationTimeInSeconds = 3600
var role = RtcRole.PUBLISHER

var app = express();
app.disable('x-powered-by');
app.set('port', PORT);

var generateRtcToken = function (req, resp) {
    var currentTimestamp = Math.floor(Date.now() / 1000)
    var privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
    var channelName = req.query.channelName;
    var uid = req.query.uid || 0;
    var role = req.query.role || 'publisher';
    var privilegeExpiredTs = req.query.privilegeExpiredTs || (currentTimestamp + expirationTimeInSeconds); // Get privilegeExpiredTs from the query parameters (default to current time + 3600 seconds)
    if (!channelName) {
        return resp.status(400).json({ 'error': 'channel name is required' }).send();
    }
    var key = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);
    resp.header("Access-Control-Allow-Origin", "*")
    //resp.header("Access-Control-Allow-Origin", "http://ip:port")
    return resp.json({ 'key': key }).send();
};

app.get('/rtcToken', generateRtcToken);


http.createServer(app).listen(app.get('port'), function () {
    console.log('Server starts at ' + app.get('port'));
});

// const { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } = require('agora-token')

// const generateRtcToken = () => {
//     // Rtc Examples
//     const appId = '4f6055507f17439295f404d8b2dd0c19';
//     const appCertificate = 'd2713813c4bb4b09b6dcff1bd4c270d6';
//     const channelName = 'abc';
//     // const uid;
//     const userAccount = "121";
//     const role = RtcRole.PUBLISHER;

//     const expirationTimeInSeconds = 3600

//     const currentTimestamp = Math.floor(Date.now() / 1000)

//     const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

//     // Build token with user account
//     const tokenB = RtcTokenBuilder.buildTokenWithUserAccount(appId, appCertificate, channelName, userAccount, role, privilegeExpiredTs);
//     console.log("Token With UserAccount: " + tokenB);
// }
// generateRtcToken()


//var fs = require('fs');
//var https = require('https');

// var generateRtmToken = function(req, resp) {
//     var currentTimestamp = Math.floor(Date.now() / 1000)
//     var privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
//     var account = req.query.account;
//     if (!account) {
//         return resp.status(400).json({ 'error': 'account is required' }).send();
//     }

// var key = RtmTokenBuilder.buildToken(appID, appCertificate, account, RtmRole, privilegeExpiredTs);

// resp.header("Access-Control-Allow-Origin", "*")
//     //resp.header("Access-Control-Allow-Origin", "http://ip:port")
// return resp.json({ 'key': key }).send();
// };

// app.get('/rtmToken', generateRtmToken);
//https.createServer(credentials, app).listen(app.get('port') + 1, function() {
//    console.log('AgoraSignServer starts at ' + (app.get('port') + 1));
//});