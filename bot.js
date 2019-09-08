const Bot = require('keybase-bot');
const wiki = require("wikijs").default;
const logger = require("winston");
const paperkey = require('./creds.json');

//const http = require('http');
//const fs = require('fs');

const username = 'keybasevision'
// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

// Configure logger settings                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
logger.remove(logger.transports.Console);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
logger.add(new logger.transports.Console, {                                                                     
    colorize: true
});
logger.level = 'debug';

// Initialize Bot
const keybaseVision = new Bot();

async function getEmbed(image) {

  // Creates a client
  const client = new vision.ImageAnnotatorClient();
  // Performs label detection on the image file
  logger.info("getting labels");
  const [result] = await client.labelDetection(image);
  const labels = result.labelAnnotations;
  logger.info('Labels:');
  return labels;
  
}

async function getPage(labels){

    return await wiki().find(labels[0].description);

}

// Gets the description of the image
async function getDescription(labels) {
    outputString = "We think it could be: " + labels.map(label => label.description).join(', ');

    const page = await getPage(labels);

    const summary = await page.summary();

    const shortWiki = summary.slice(0,200) + "...";

    const url = page.raw.fullurl;

    outputString += " | " + url + " | " + shortWiki;

    return outputString
}

/*
async function getImage(labels, channel) {
    const page = await getPage(labels);

    const file = fs.createWriteStream("wikiMainImage.jpg");
    const request = http.get((await page.mainImage()).replace('https', 'http'), response => {
        response.pipe(file);
        keybaseVision.chat.attach(channel, './wikiMainImage.jpg');
    });
}
*/

keybaseVision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
  .init(username, paperkey.paperkey, {verbose: false})
  .then(() => {
    logger.info(`Your bot is initialized. It is logged in as ${keybaseVision.myInfo().username}`) // Console Information

    keybaseVision.chat.watchAllChannelsForNewMessages(message => {
        const channel = message.channel;
        if(message.content.type === "attachment") { // Checks for an uploaded image and downloads
            keybaseVision.chat.download(channel, message.id, "./current.jpg")
                .catch(error => {
                    console.error(error)
                })
        }
    })

    keybaseVision.chat.watchAllChannelsForNewMessages(message => {
        const channel = message.channel;
        if (message.content.text.body === "!classify") {
            getEmbed("./current.jpg")
                .then(labels => {
                    //getImage(labels, channel);
                    return getDescription(labels);
                })
                .then(finalMessage => keybaseVision.chat.send(channel, {body: finalMessage})) // Image description output
        }
    })
  })
  .catch(error => {
    console.error(error)
    keybaseVision.deinit()
  })
  