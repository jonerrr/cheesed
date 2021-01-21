const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const db = require("./db.json");
const agroify = require("./agroify");
const mineflayer = require("mineflayer");
const fs = require("fs");
let cheeseTotal = {
  total: db.total,
  whitelistedServerIds: db.whitelistedServerIds,
};

// const bot = mineflayer.createBot({
//   host: config.minecraftAccount.server,
//   port: config.minecraftAccount.port,
//   username: config.minecraftAccount.email,
//   password: config.minecraftAccount.password,
//   version: config.minecraftAccount.version,
//   auth: config.minecraftAccount.auth,
//   version: config.minecraftAccount.version,
// });

function rand(min, max) {
  let randomNum = Math.random() * (max - min) + min;
  return Math.round(randomNum);
}

function cheeseGuild() {
  bot.chat(`/g kick ${config.minecraft.usernameToKick} trollololol cheesed`);
  setTimeout(() => {
    bot.chat(`/g invite ${config.minecraft.usernameToKick}`);
  }, 3000);
  console.log("guy just got cheesed in guild");
}

function writeToDB() {
  let data = JSON.stringify(cheeseTotal);
  fs.writeFileSync("./db.json", data);
}

function readFromDB() {
  let data = fs.readFileSync("./db.json");
  let obj = JSON.parse(data);
  //  console.log(obj[object]);
  return obj.total;
}

const whitelistedId = async (authorId) => {
  const whitelistedIds = config.bot.whitelistedIds;
  if (whitelistedIds.includes(authorId)) return true;

  return false;
};

client.on("ready", () => {
  console.log(`logged in as ${client.user.tag}`);
  client.user.setStatus("idle");
  client.user.setPresence({
    status: "idle",
    activity: {
      name: "captaincheddar🤣🤣🤣😎😎",
      type: "WATCHING",
    },
  });
});

client.on("message", function (message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.bot.prefix)) return;
  const commandBody = message.content.slice(config.bot.prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  function kick(command2, userID, kickMessage, pronoun, pronoun2, count) {
    const memberToKick = message.guild.members.cache.get(userID);
    if (command === command2) {
      if (memberToKick && memberToKick.kickable) {
        if (count === true) {
          cheeseTotal.total++;
          writeToDB(cheeseTotal);
          console.log(`cheddar has been cheesed (successful) ${db.total}`);
        } else if (count === false) {
          console.log("counting was false");
        }
        message.reply(kickMessage);
        memberToKick.kick("GET CHEESED TROLOLOL");
      } else if (!memberToKick) {
        message.reply(`${pronoun} IS NOT IN THE SERVER ANYMORE 😭😭😭`);
      } else if (!memberToKick.kickable) {
        message.reply(`I DONT HAVE PERMS TO KICK ${pronoun2} !!! 😭😭😭`);
        console.log("NO PERMS!!");
      } else {
        message.reply(`I COULDNT FREAKING KICK ${pronoun2} WTF???`);
      }
    }
  }

  kick(
    "cheese",
    config.idsToKick.ids[0],
    "CHEESED TROLOLOLOLOL <:emoji:735308015607218279> https://media.discordapp.net/attachments/735022070286778408/760201509702729768/caption.gif",
    "he",
    "him",
    true
  );
  kick(
    "catfish",
    config.idsToKick.ids[1],
    "https://cdn.discordapp.com/attachments/625062074245971979/800532282372653086/unknown.png",
    "she",
    "her",
    false
  );
  if (command === "help") {
    const helpEmbed = new Discord.MessageEmbed()
      .setColor("#FFDC00")
      .setTitle("cheesed help 🙀🙀😼🙀😼")
      .setThumbnail(
        "https://cdn.discordapp.com/avatars/801873143437983754/7d247a3dfdbe79817391c6d62d135ee7.png?size=256"
      )
      .addFields(
        { name: "!cheese", value: "cheeses 🙀😼" },
        { name: "!catfish", value: "trolls herbman" },
        { name: "agroify [image url]", value: "awesomes the image" },
        { name: "!count", value: "tells u amount of cheese" },
        {
          name: "!blacklistserver",
          value: "stops server from getting trolled by your, ur, sus, and more",
        },
        {
          name: "!unblacklistserver",
          value: "does opposite of last command",
        },
        { name: "!rule", value: "displays important rule" }
      )
      .setFooter(
        "made by jonah",
        "https://cdn.discordapp.com/avatars/738605862872023048/a751915cef7f8e6b8e84fc59f141bdc7.png?size=256"
      );
    message.channel.send(helpEmbed);
  }
});

client.on("message", function (message) {
  if (message.author.bot) return;
  if (message.content.startsWith("agroify")) return agroify.makeFile(message);
  function wordResponse(word, reply) {
    if (message.content.toLowerCase().includes(word)) {
      message.channel.send(config.bot.yourResponse[0]);
      message.channel.send(reply[rand(0, reply.length)]);
    }
  }
  wordResponse("your", config.bot.yourResponse);
  wordResponse("ur", config.bot.yourResponse);
  wordResponse("sus", config.bot.susResponse);
  wordResponse("rule", config.bot.ruleResponse);
});

client.login(config.bot.token);
