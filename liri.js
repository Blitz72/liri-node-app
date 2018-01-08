require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");

var keys = require("./keys.js");

var nodeArgs = process.argv;
var textFile = "log.txt";	//var textFile = "test.txt";

function myTweets() {

	var client = new Twitter(
		keys.twitterKeys
	);
		 
	var params = {screen_name: 'bauerdavid2'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {

	  if (!error) {

	  	fs.appendFileSync(textFile, "my-tweets\n");

	  	var length = 20;
	  	if (tweets.length < 20) length = tweets.length;
	    for (var i = 0; i < length; i++) {

	    	console.log(tweets[i].text);
	    	fs.appendFileSync(textFile, tweets[i].text + '\n');

	    	console.log('  Tweeted on or about: ', tweets[i].created_at);
	    	fs.appendFileSync(textFile, '  Tweeted on or about: ' + tweets[i].created_at + '\n');

	    }

	    fs.appendFileSync(textFile, '-------Logged: ' + Date() + '-------\n\n');
			console.log('File logged to: ' + textFile);

	  } else if (error) {
	  	return console.log('Error: ', error);
	  }

	});
}

function spotifyThisSong(song) {

	var spotify = new Spotify(
		keys.spotifyKeys
	);

	var indexer = 0;

	fs.appendFileSync(textFile, "spotify-this-song " + song + '\n');
		 
	spotify.search({ type: 'track', query: song, limit: 20 }, function(error, data) {

		if (error) {
			console.log('Error: ' + error + '\n' + 'Check your spelling and try again.');
			fs.appendFileSync(textFile, 'Error: ' + error + '\n' + 'Please check your spelling and try again.\n');
			fs.appendFileSync(textFile, '-------Logged: ' + Date() + '-------\n\n');
			return;
		}

		for (var i = 0; i < data.tracks.items.length; i++){
			if (data.tracks.items[i].name === song) {
				indexer = i;
				break;
			}
		}

		console.log('Artist(s): ', data.tracks.items[indexer].artists[0].name);
		fs.appendFileSync(textFile, 'Artist(s): ' + data.tracks.items[indexer].artists[0].name + '\n');

		console.log('Song: ', data.tracks.items[indexer].name);
		fs.appendFileSync(textFile, 'Song: ' + data.tracks.items[indexer].name + '\n');

		console.log('Preview: ', data.tracks.items[indexer].preview_url);
		fs.appendFileSync(textFile, 'Preview: ' + data.tracks.items[indexer].preview_url + '\n');

		console.log('Album: ', data.tracks.items[indexer].album.name);
		fs.appendFileSync(textFile, 'Album: ' + data.tracks.items[indexer].album.name + '\n');

		fs.appendFileSync(textFile, '-------Logged: ' + Date() + '-------\n\n');
		console.log('File logged to: ' + textFile);

	});
}

function movieThis(title) {

	request("http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
		if (error) {
			console.log('Error:', error + '\n' + 'Please check your spelling and try again.');
			fs.appendFileSync(textFile, 'Error: ' + error + '\n' + 'Check your spelling and try again.\n');
			fs.appendFileSync(textFile, '-------Logged: ' + Date() + '-------\n\n');
			return;
		}

		fs.appendFileSync(textFile, "movie-this " + title + '\n');

		var data = JSON.parse(body, null, 2);

		if (data.Response === 'False') {
			console.log('An error ocurred: ' + data.Error + '\n' + 'Please check your spelling and try again.\n');
			fs.appendFileSync(textFile, 'An error ocurred: ' + data.Error + '\n');
			fs.appendFileSync(textFile, '-------Logged: ' + Date() + '-------\n\n');
			return;
		} else if (data) {
			console.log('Title: ', data.Title);
			fs.appendFileSync(textFile, 'Title: ' + data.Title + '\n');

			console.log('Year released: ', data.Year);
			fs.appendFileSync(textFile, 'Year released: ' + data.Year + '\n');

			console.log('IMDB rating: ', data.imdbRating);
			fs.appendFileSync(textFile, 'IMDB rating: ' + data.imdbRating + '\n');

			console.log('Rotten Tomatoes rating: ', data.Ratings[1].Value);
			fs.appendFileSync(textFile, 'Rotten Tomatoes rating: ' + data.Ratings[1].Value + '\n');

			console.log('Country(s) of production: ', data.Country);
			fs.appendFileSync(textFile, 'Country(s) of production: ' + data.Country + '\n');

			console.log('Language: ', data.Language);
			fs.appendFileSync(textFile, 'Language: ' + data.Language + '\n');

			console.log('Plot: ', data.Plot);
			fs.appendFileSync(textFile, 'Plot: ' + data.Plot + '\n');

			console.log('Actors: ', data.Actors);
			fs.appendFileSync(textFile, 'Actors: ' + data.Actors + '\n');

			fs.appendFileSync(textFile, '-------Logged: ' + Date() + '-------\n\n');
			console.log('File logged to: ' + textFile);

		} else {
			console.log('No data to display. You can always try Siri or Alexa.')
		}

	});
}

switch (nodeArgs[2]) {

	case "my-tweets":
		
		myTweets();

		break;

	case "spotify-this-song":

		var song = "";

		for (i = 3; i < nodeArgs.length; i++){
			song = song + nodeArgs[i] + ' ';
		}

		song = song.trim();

		if (!song) {
			song = "The Sign";
		}

		console.log(song);
		spotifyThisSong(song);

		break;

	case "movie-this":

		var title = "";

		for (i = 3; i < nodeArgs.length; i++){
			title = title + nodeArgs[i] + ' ';
		}

		title = title.trim();

		if (!title) {
			title = "Star Wars";
		}

		// console.log(title);
		movieThis(title);

		break;

	case "do-what-it-says":

		fs.appendFileSync(textFile, "do-what-it-says '");

		fs.readFile("random.txt", "utf8", function(error, data) {

		  if (error) {
		    return console.log('Error: ', error);
		  }

		  console.log(data);
		  var dataArr = data.split(",");
		  // console.log(dataArr);

		  fs.appendFileSync(textFile, dataArr[0] + ' ' + dataArr[1] + "'\n");

		  if (dataArr[0] === "my-tweets") {
				myTweets();
			} else if (dataArr[0] === "spotify-this-song") {
				spotifyThisSong(dataArr[1]);
			} else if (dataArr[0] === "movie-this") {
				movieThis(dataArr[1]);
			} else {
				console.log("I'm sorry, I don't know what you mean. Try asking Siri or Alexa. Maybe they can help.");
			}

		});

		break;

	default:

		console.log("I'm sorry, I don't know what you mean. Try asking Siri or Alexa. Maybe they can help.");

		break;

}