require("dotenv").config();
var fs = require("fs");
var Spotify = require('node-spotify-api');
var moment = require("moment");
var keys = require("./keys.js");
var request = require("request");
var userInput = process.argv;
var command = userInput[2];
var userArgs = "";
var userArgs2 = "";
for (var i = 3; i < userInput.length; i++) {
    if (i > 3 && i < userInput.length) {

        userArgs = userArgs + "+" + userInput[i];
        userArgs2 = userArgs2 + " " + userInput[i];
    }
    else {
        userArgs += userInput[i];
        userArgs2 += userInput[i];
    }
}
console.log("Command: " + command);
console.log("User search: " + userArgs2);
function swFun() {
    log = "Command: " + command + "\n" + "User argument: " + userArgs2 + "\n" + "-------------- \r\n"
    fs.appendFile("log.txt", log, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Log updated \n");
        }

    });
    var bandsInTownUrl = "https://rest.bandsintown.com/artists/" + userArgs + "/events?app_id=codingbootcamp"
    var OMDBUrl = "https://www.omdbapi.com/?t=" + userArgs + "&y=&plot=short&apikey=trilogy";
    switch (command) {
        case "concert-this":
            request(bandsInTownUrl, function (error, response, data) {
                if (!error && response.statusCode === 200) {

                    var bandsRes = JSON.parse(data);
                    /*console.log(res[2]);*/
                    for (var i = 0; i < bandsRes.length; i++) {
                        console.log(bandsRes[i].venue.name);
                        console.log(bandsRes[i].venue.city + " " + bandsRes[i].venue.region + " " + bandsRes[i].venue.country);
                        console.log(moment(bandsRes[i].datetime).format("LL"));
                        console.log("----------------");
                    }
                }
            })
            break;
        case "spotify-this-song":
            var spotify = new Spotify(keys.spotify);
            if (userArgs) {
                spotify.request("https://api.spotify.com/v1/search?q=" + userArgs + "&type=track&limit=5").then(function (data) {
                    for (var s = 0; s < data.tracks.items.length; s++) {
                        var artists = []
                        artists += (data.tracks.items[s].artists[0].name);
                        for (var i = 1; i < data.tracks.items[s].artists.length; i++) {
                            artists += ", " + (data.tracks.items[s].artists[i].name);
                        }

                        console.log("Artist: " + artists);
                        console.log("Song name: " + data.tracks.items[s].name);
                        console.log("Spotify Link: " + data.tracks.items[s].external_urls.spotify);
                        console.log("----------------");
                    }
                }).catch(function (err) {
                    console.error('Error occurred: ' + err);
                });
            }
            else {
                spotify.request("https://api.spotify.com/v1/search?q=the+sign+ace+of+base&type=track").then(function (data) {
                    var artists = []
                    artists += (data.tracks.items[0].artists[0].name);
                    for (var i = 1; i < data.tracks.items[0].artists.length; i++) {
                        artists += ", " + (data.tracks.items[0].artists[i].name);
                    }
                    console.log("Artist: " + artists);
                    console.log("Song name: " + data.tracks.items[0].name)
                    console.log("Spotify Link: " + data.tracks.items[0].external_urls.spotify)
                }).catch(function (err) {
                    console.error('Error occurred: ' + err);
                });
            }
            break;
        case "movie-this":
            request(OMDBUrl, function (error, response, data) {
                if (!error && response.statusCode === 200) {
                    var movRes = JSON.parse(data);
                    console.log("Title: " + movRes.Title);
                    console.log("Release year: " + movRes.Year);
                    console.log("IMDB Rating: " + movRes.imdbRating);
                    console.log("Rotten Tomatoes Rating: " + movRes.Ratings[1].Value);
                    console.log("Country: " + movRes.Country);
                    console.log("Language(s): " + movRes.Language);
                    console.log("Plot: " + movRes.Plot);
                    console.log("Actors: " + movRes.Actors);
                }

            })
            break;
        case "do-what-it-says":
            fs.readFile("random.txt", "utf8", function (error, data) {
                if (error) {
                    return console.log(error);
                }
                var dataArr = data.split(",");
                command = dataArr[0];
                userArgs = dataArr[1];
                userArgs2 = dataArr[1];
                if (command === "do-what-it-says") {
                    console.log("If I do that then I'd enter a loop a never ending loop!!!")
                }
                else {

                    swFun();
                }

            });
            break;
    }
}
swFun();