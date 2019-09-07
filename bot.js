const Bot = require('keybase-bot');
const wiki = require("wikijs").default;
const logger = require("winston");
const paperkey = require('./creds.json');

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

async function getDescription(labels) {
    outputString = "We think it could be: " + labels.map(label => label.description).join(', ');

    const page = await wiki().find(labels[0].description);

    const summary = await page.summary()
    
    outputString += summary;

    return outputString
}

keybaseVision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
  .init(username, paperkey.paperkey, {verbose: false})
  .then(() => {
    logger.info(`Your bot is initialized. It is logged in as ${keybaseVision.myInfo().username}`)

    keybaseVision.chat.watchAllChannelsForNewMessages(message => {
        const channel = message.channel;
        if(message.content.type === "attachment") {
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
                .then(labels => getDescription(labels)).then(summary => 
                    keybaseVision.chat.send(channel, {body: summary}))
        }
    })
  })
  .catch(error => {
    console.error(error)
    keybaseVision.deinit()
  })
  