require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var bandsInTownUrl = "https://rest.bandsintown.com/artists/" + userArgs + "/events?app_id=codingbootcamp"
var userInput = process.argv;
var command = userInput[2];
var userArgs = "";


for (var i = 3; i < userInput.length; i++) {
    if (i > 3 && i < userInput.length) {

        userArgs = userArgs + "+" + userInput[i];
    }
    else {
        userArgs += userInput[i];
    }
}
console.log(command);
console.log(userArgs);
var bandsInTownUrl = "https://rest.bandsintown.com/artists/" + userArgs + "/events?app_id=codingbootcamp"
switch (command) {
    case "concert-this":

        request(bandsInTownUrl, function (error, response, data) {
            if (!error && response.statusCode === 200) {

                /*for (i = 0; i < body.length; i++) {
                    console.log(JSON.parse(body[i].venue.name));
                }*/

                console.log(JSON.parse(data));
                var res = JSON.parse(data);
                console.log("----------------")
                console.log(res[0].venue.name);
            }
        })
        break;
}