//pull all the requires neeeded and set global variables
require("dotenv").config();
var Spotify = require('node-spotify-api');
var moment = require("moment");
var keys = require("./keys.js");
var request = require("request");
var bandsInTownUrl = "https://rest.bandsintown.com/artists/" + userArgs + "/events?app_id=codingbootcamp"
var userInput = process.argv;
var command = userInput[2];
var userArgs = "";
var userArgs2 = "";
//for loop to get user input after command
for (var i = 3; i < userInput.length; i++) {
    if (i > 3 && i < userInput.length) {
        //when various words exist in input pushes each word to array and makes it readable for queryurl 
        userArgs = userArgs + "+" + userInput[i];
    }
    else {
        //pushes first word after command to array
        userArgs += userInput[i];
    }
}
//console.log command and user search 
console.log("Command: " + command);
console.log("User search: " + userArgs2);
//function that checks command and runs the according code
function swFun() {
    //set up a var that receives user input to sotre it in a log
    var log = "Command: " + command + "\n" + "User argument: " + userArgs2 + "\n" + "-------------- \r\n"
    //use fs node package to create log.txt and append each user Input 
    fs.appendFile("log.txt", log, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Log updated \n");
        }

    });
    //set up the bands in town Url and OMDB  url in a variable
    var bandsInTownUrl = "https://rest.bandsintown.com/artists/" + userArgs + "/events?app_id=codingbootcamp"
    var OMDBUrl = "https://www.omdbapi.com/?t=" + userArgs + "&y=&plot=short&apikey=trilogy";
    //switch to identify the command
    switch (command) {
        //takes care of the concert-this command, makes the request 
        case "concert-this":
            request(bandsInTownUrl, function (error, response, data) {
                if (!error && response.statusCode === 200) {
                    //gets data and turns it into JSON
                    var bandsRes = JSON.parse(data);
                    //for loop that checks each event and gets the info needed
                    for (var i = 0; i < bandsRes.length; i++) {
                        //console log the info 
                        console.log("Venue Name: " + bandsRes[i].venue.name);
                        console.log("Location: " + bandsRes[i].venue.city + " " + bandsRes[i].venue.region + " " + bandsRes[i].venue.country);
                        console.log("Date: " + moment(bandsRes[i].datetime).format("LL"));
                        console.log("----------------");
                    }
                }
            });
            break;
        //takes care of the spotify-this-song command, and makes the request
        case "spotify-this-song":
            //Uses constructure to create new spotify object that has the spotify id keys
            var spotify = new Spotify(keys.spotify);
            //checks if userArgs exist then runs the request is so limited to 5 results
            if (userArgs) {
                spotify.request("https://api.spotify.com/v1/search?q=" + userArgs + "&type=track&limit=5").then(function (data) {
                    //for each result loop through them to get the info needed
                    for (var s = 0; s < data.tracks.items.length; s++) {
                        //empty artis array that will receives the artist or artists of the track
                        var artists = []
                        //first artis goes directly to array
                        artists += (data.tracks.items[s].artists[0].name);
                        //Loops through the other artist if there are any more
                        for (var i = 1; i < data.tracks.items[s].artists.length; i++) {
                            artists += ", " + (data.tracks.items[s].artists[i].name);
                        }
                        //console log the info 
                        console.log("Artist: " + artists);
                        console.log("Song name: " + data.tracks.items[s].name);
                        console.log("Spotify Link: " + data.tracks.items[s].external_urls.spotify);
                        console.log("----------------");
                    }

                    console.log("Artist: " + artists);
                    console.log("Song name: " + data.tracks.items[0].name)
                    console.log("Spotify Link: " + data.tracks.items[0].external_urls.spotify)
                }).catch(function (err) {
                    console.error('Error occurred: ' + err);
                });
            }
            //if no user argument given then shows default song
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
        //takes care of the movie-this command, and makes the request
        case "movie-this":
            request(OMDBUrl, function (error, response, data) {
                if (!error && response.statusCode === 200) {
                    //turns data info JSON  object and stores in variable
                    var movRes = JSON.parse(data);
                    //console log info
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
        //takes care of the do-what-it-says command, and makes the request
        case "do-what-it-says":
            //accesses the file system and reads the random.txt file
            fs.readFile("random.txt", "utf8", function (error, data) {
                if (error) {
                    return console.log(error);
                }
                //puts the text in array splitting them at the coma
                var dataArr = data.split(",");
                //changes command and userArgs accordingly to what's in random.txt
                command = dataArr[0];
                userArgs = dataArr[1];
                userArgs2 = dataArr[1];
                //checks if new command is equal to do-what-it-says cancels and saves us from eternal loop!
                if (command === "do-what-it-says") {
                    console.log("If I do that then I'd enter a loop a never ending loop!!!")
                }
                //if command is different runs switch command to run new command from random.txt
                else {
                    swFun();
                }
            });
            break;
    }
}
//checks user Input and makes sure that the first Input is a valid command, if so runs switch else tells you to run a correct one 
if (command === "spotify-this-song" || command === "concert-this" || command === "movie-this" || command === "do-what-it-says") {
    swFun();
}
else {
    console.log("\nEnter a valid command");
}
