//const RapidAPI = require('rapidapi-connect');
const Twilio = require('twilio');
const config = require('../config');

function getGif(gifText) {
    try {
        const rapid = new RapidAPI(config.rapidApi.projectName, config.rapidApi.accountNumber);
        return new Promise((resolve, reject) => {
            rapid.call('Giphy', 'translateTextToGif', { 
                'apiKey': config.giphyApiKey,
                'text': gifText,
                'rating': 'G',
                'lang': 'en'
            }).on('success', (payload) => {
                resolve(payload.data.images.fixed_height.url);
            }).on('error', (payload)=>{
                reject("Error finding GIF");
            });
        });
    } catch(e) {
        return Promise.resolve(null);
    }
}

function sendTextWithGif(number, text, gifText) {
    const twilio = Twilio(config.twilio.accountSid, config.twilio.authToken);
    return getGif(gifText)
        .then((gifUrl) => {
            return new Promise((resolve, reject) => {
                twilio.messages.create({
                    to: number,
                    from: config.twilio.from,
                    body: text,
                    mediaUrl: config.twilio.gifUrl || gifText,
                }, (err, message) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(message.sid);
                });
            });
        });
}

module.exports = {
    sendTextWithGif
}