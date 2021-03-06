// console.log('keys are loaded');

var twitterKeys = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}

var spotifyKeys = {
	id: process.env.SPOTIFY_ID,
	secret: process.env.SPOTIFY_SECRET
}

module.exports = {
	twitterKeys: twitterKeys,
	spotifyKeys: spotifyKeys
}