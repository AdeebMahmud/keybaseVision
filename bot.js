const Bot = require('keybase-bot')
const wiki = require("wikiquote");
const username = 'keybasevision'
const logger = require()
const paperkey = require('./creds.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Bot
const keybaseVision = new Bot();

bot
  .init(username, paperkey, {verbose: false})
  .then(() => {
    logger.info(`Your bot is initialized. It is logged in as ${bot.myInfo().username}`)

    bot.chat.watchAllChannelsForNewMessages(message => {
        const channel = message.channel;
        if(message.content.type === "attatchment") {
            bot.chat.download(channel, message.id, "./current.png");
        }
    })

    }
  })
  .catch(error => {
    console.error(error)
    bot.deinit()
  })