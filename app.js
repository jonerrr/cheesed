const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const db = require("./db.json");
const agroify = require("./agroify");
// const mineflayer = require("mineflayer");
const dynamoose = require("dynamoose");
const Filter = require("bad-words");
const filter = new Filter();
filter.removeWords("nigga", "nigger"); // nword counter is going to delete messages with the nword
// const bot = mineflayer.createBot({
//   host: config.minecraft.server,
//   port: config.minecraft.port,
//   username: config.minecraft.email,
//   password: config.minecraft.password,
//   version: config.minecraft.version,
//   auth: config.minecraft.auth,
//   version: config.minecraft.version,
// });

dynamoose.aws.sdk.config.update({
  accessKeyId: "",
  secretAccessKey: "",
  region: "us-east-1",
});

const nwordSchema = new dynamoose.Schema({
  id: {
    type: String,
  },
  nwordCount: {
    type: Number,
  },
});

const whitelistSchema = new dynamoose.Schema({
  id: {
    type: String,
  },
  whitelisted: {
    type: Boolean,
  },
});

const cheeseCountSchema = new dynamoose.Schema({
  id: {
    type: Number,
  },
});

const nwordModel = dynamoose.model("cheesed-counter", nwordSchema, {
  throughput: {
    read: 1,
    write: 1,
  },
});

const whitelistModel = dynamoose.model("cheesed-whitelist", whitelistSchema, {
  throughput: {
    read: 1,
    write: 1,
  },
});

const cheeseCountModel = dynamoose.model("cheesed-count", cheeseCountSchema, {
  throughput: {
    read: 1,
    write: 1,
  },
});

function rand(min, max) {
  let randomNum = Math.random() * (max - min) + min;
  return Math.floor(randomNum);
}

// function cheeseGuild() {
//   bot.chat(`/g kick ${config.minecraft.usernameToKick} trollololol cheesed`);
//   setTimeout(() => {
//     bot.chat(`/g invite ${config.minecraft.usernameToKick}`);
//   }, 3000);
//   console.log("guy just got cheesed in guild");
//

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

// bot.on("chat", function (message) {
//   if (message.includes("cheese")) {
//     bot.chat("/gc fart");
//     console.log("fart");
//   }
// });

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
          cheeseCountModel.get("id", (error, results) => {
            if (error) {
              message.channel.send(error);
            } else {
              console.log(results);
            }
          });
          // console.log(`cheddar has been cheesed (successful) ${db.total}`);
        } else if (count === false) {
          // console.log("counting was false");
        }
        message.reply(kickMessage);
        memberToKick.kick("GET CHEESED TROLOLOL");
      } else if (!memberToKick) {
        cheeseCountModel.get("id", (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log(results);
          }
        });
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
    "CHEESED TROLOLOLOLOL <:emoji:792188874235183155> https://media.discordapp.net/attachments/735022070286778408/760201509702729768/caption.gif",
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
        // {
        //   name: "!cheesg",
        //   value: "cheese in guild😼😼",
        // },
        { name: "!catfish", value: "trolls herbman" },
        { name: "agroify [image url]", value: "awesomes the image" },
        { name: "!count", value: "tells u amount of cheese" },
        {
          name: "!blacklistserver",
          value: "stops server from getting trolled by your, sus, and rule",
        },
        {
          name: "!unblacklistserver",
          value: "does opposite of last command",
        },
        {
          name: "!n <@person>",
          value: "tells you amount of nwords the person said",
        },
        {
          name: "!lb",
          value: "nword leaderboard",
        },
        {
          name: "Bot invite",
          value:
            "[click here](https://discord.com/api/oauth2/authorize?client_id=758542490218790912&permissions=379907&scope=bot)",
          inline: true,
        }
      )
      .setFooter(
        "made by jonah",
        "https://cdn.discordapp.com/avatars/738605862872023048/a751915cef7f8e6b8e84fc59f141bdc7.png?size=256"
      );
    message.channel.send(helpEmbed);
  } else if (command === "count") {
    message.channel.send(
      `captaincheddar has been cheesed ${db.total} times <:emoji:792188874235183155>
`
    );
  } else if (command === "blacklistserver") {
    const server = message.guild.id;
    // const newServer = new whitelistModel({
    //   id: server,
    //   whitelisted: true,
    // });
    // newServer.save((error) => {
    //   if (error) {
    //     console.error(error);
    //   } else {
    //     message.channel.send("server blacklisted");
    //   }
    // });
    message.channel.send("nope");
  } else if (command === "unblacklistserver") {
    const serverId = message.guild.id;
    // console.log(serverId);
    // whitelistModel.get(serverId, (error, results) => {
    //   if (error) {
    //     console.error(error);
    //   } else {
    //     if (results === undefined) {
    //       message.channel.send("server not blacklisted");
    //     } else {
    //       serverId.delete((error) => {
    //         if (error) {
    //           console.error(error);
    //         } else {
    //           message.channel.send("unblacklisted server");
    //         }
    //       });
    //     }
    //   }
    // });
    message.channel.send("nope");
  } else if (command === "cheesg") {
    message.channel.send("shgut up");
    message.channel.send("<:emoji:792188874235183155>");
  } else if (command === "n" || command === "nword") {
    const personTagged = message.mentions.members.first();
    if (personTagged) {
      nwordModel.get(personTagged, (error, results) => {
        if (error) {
          message.channel.send(error);
        } else {
          if (results === undefined || results === 0) {
            message.channel.send(
              `<@${personTagged.id}> has not said the nword yet 😎`
            );
          } else {
            message.channel.send(
              `<@${personTagged.id}> has said the nword ${results.nwordCount} times 🙀🙀`
            );
          }
        }
      });
    } else if (!personTagged) {
      message.channel.send("shut up and tag someone");
    }
  } else if (command === "lb") {
    // const lbEmbed = new Discord.MessageEmbed()
    //   .setColor("#FFDC00")
    //   .setTitle("top 10 racisms 🙀🙀😼🙀😼")
    //   .setThumbnail(
    //     "https://cdn.discordapp.com/avatars/801873143437983754/7d247a3dfdbe79817391c6d62d135ee7.png?size=256"
    //   )
    //   .addFields(
    //     { name: `1.`, value: `<@${one[0]}> with ${one[1]} nwords` },
    //     { name: `2.`, value: `<@${two[0]}> with ${two[1]} nwords` },
    //     { name: `3.`, value: `<@${three[0]}> with ${three[1]} nwords` },
    //     { name: `4.`, value: `<@${four[0]}> with ${four[1]} nwords` },
    //     { name: `5.`, value: `<@${five[0]}> with ${five[1]} nwords` },
    //     { name: `6.`, value: `<@${six[0]}> with ${six[1]} nwords` },
    //     { name: `7.`, value: `<@${seven[0]}> with ${seven[1]} nwords` },
    //     { name: `8.`, value: `<@${eight[0]}> with ${eight[1]} nwords` },
    //     { name: `9.`, value: `<@${nine[0]}> with ${nine[1]} nwords` },
    //     { name: `10.`, value: `<@${ten[0]}> with ${ten[1]} nwords` }
    //   )
    //   .setFooter(
    //     "made by jonah",
    //     "https://cdn.discordapp.com/avatars/738605862872023048/a751915cef7f8e6b8e84fc59f141bdc7.png?size=256"
    //   );
    nwordModel.scan().exec((error, results) => {
      if (error) {
        console.error(error);
      } else {
        // const fart = results[0];
        // console.log(fart);
        message.channel.send(results);
      }
    });

    //find user id by object value
  }
});

client.on("message", function (message) {
  if (message.author.bot) return;
  if (message.content.startsWith("agroify")) return agroify.makeFile(message);
  function wordResponse(word, reply) {
    const isInArray = db.whitelistedServerIds.includes(message.guild.id);
    if (message.content.toLowerCase().includes(word) && isInArray === false) {
      message.channel.send(reply[rand(0, reply.length)]);
    }
  }
  if (filter.isProfane(message)) {
    message.fetch(message.id).then((msg) => msg.delete());
  }
  wordResponse("your", config.bot.yourResponse);
  wordResponse("sus", config.bot.susResponse);
  wordResponse("rule", config.bot.ruleResponse);
  wordResponse("🌮", ["🌮"]);
  wordResponse(":emoji", ["<:emoji:735308018320932905>"]);
  wordResponse("obama", [
    ` ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠛⠛⠛⠉⠉⠉⠋⠛⠛⠛⠻⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠛⠉⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠉⠙⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠋⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠈⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿
      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠏⠄⠄⠄⠄⠄⠄⠄⠂⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠈⠹⣿⣿⣿⣿⣿⣿⣿
      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⠛⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠠⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠘⢻⣿⣿⣿⣿⣿
      ⣿⣿⣿⣿⣿⣿⣿⣿⠃⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢀⠄⢠⠄⠄⡀⠄⠄⢀⠂⠄⠄⠄⠄⠄⠄⠄⠄⠄⡁⠄⠄⢛⣿⣿⣿⣿
      ⣿⣿⣿⣿⣿⣿⣿⡇⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⡈⢔⠸⣐⢕⢕⢵⢰⢱⢰⢐⢤⡡⡢⣕⢄⢢⢠⠄⠄⠄⠄⠄⠄⠙⣿⣿⣿
      ⣿⣿⣿⣿⣿⣿⣿⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⡁⠂⠅⢕⠌⡎⡎⣎⢎⢮⢮⣳⡳⣝⢮⢺⢜⢕⢕⢍⢎⠪⡐⠄⠁⠄⠸⣿⣿
      ⣿⣿⣿⣿⣿⣿⠏⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠄⠄⢅⠣⡡⡣⣣⡳⡵⣝⡮⣗⣗⡯⣗⣟⡮⡮⣳⣣⣳⢱⢱⠱⣐⠄⠂⠄⢿⣿
      ⣿⣿⣿⣿⣿⣿⠄⠄⠄⠄⠄⠄⠄⠂⠄⠄⠄⠄⠄⠄⢂⢈⠢⡱⡱⡝⣮⣿⣟⣿⣽⣷⣿⣯⣿⣷⣿⣿⣿⣾⣯⣗⡕⡇⡇⠄⠂⡀⢹⣿
      ⣿⣿⣿⣿⣿⡟⠄⠄⠄⠄⠄⠄⠂⠄⠄⠄⠄⠄⠄⠐⢀⢂⢕⢸⢨⢪⢳⡫⣟⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡺⡮⡣⡣⠠⢂⠒⢸⣿
      ⣿⣿⣿⣿⣿⡇⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠠⠐⠄⡂⠆⡇⣗⣝⢮⢾⣻⣞⣿⣿⣿⣿⣿⣿⣿⣿⢿⣽⣯⡯⣺⢸⢘⠨⠔⡅⢨⣿
      ⣿⣿⠋⠉⠙⠃⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠁⠄⠄⠄⡂⡪⡪⡪⡮⡮⡯⣻⣽⣾⣿⣿⣿⣟⣿⣿⣿⣽⣿⣿⡯⣯⡺⡸⡰⡱⢐⡅⣼⣿
      ⣿⠡⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠠⠈⠆⠱⠑⠝⠜⠕⡝⡝⣞⢯⢿⣿⣿⡿⣟⣿⣿⣿⡿⡿⣽⣷⣽⡸⡨⡪⣂⠊⣿⣿
      ⣿⠡⠄⡨⣢⠐⠁⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠍⡓⣗⡽⣝⠽⠍⠅⠑⠁⠉⠘⠘⠘⠵⡑⢜⢀⢀⢉⢽
      ⣿⠁⠠⢱⢘⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠈⠈⠱⣁⠜⡘⠌⠄⠄⡪⣳⣟⡮⢅⠤⠠⠄⠄⣀⣀⡀⡀⠄⠈⡂⢲⡪⡠⣿
      ⣿⡇⠨⣺⢐⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⡀⠄⠄⠄⠤⡠⡢⢒⠦⠠⠄⠄⠄⡸⢽⣟⢮⠢⡂⡐⠄⡈⡀⠤⡀⠄⠑⢄⠨⢸⡺⣐⣿
      ⣿⣿⠈⠕⠁⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⡂⡪⡐⡥⢤⣰⣰⣰⡴⡮⠢⠂⠄⠄⡊⢮⢺⢕⢵⢥⡬⣌⣒⡚⣔⢚⢌⢨⢚⠌⣾⡪⣾⣿
      ⣿⣿⣆⠄⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⡑⢕⢕⡯⡷⣕⢧⢓⢭⠨⡀⠄⡂⠨⡨⣪⡳⣝⢝⡽⣻⣻⣞⢽⣲⢳⢱⢡⠱⠨⣟⢺⣿⣿
      ⣿⣿⣿⡆⠄⡅⠇⡄⠄⠄⠄⠄⠄⠄⠄⠐⠨⢪⢹⢽⢽⣺⢝⠉⠁⠁⠄⠄⠄⢌⢎⡖⡯⡎⡗⢝⠜⣶⣯⣻⢮⡻⣟⣳⡕⠅⣷⣿⣿⣿
      ⣿⣿⣿⣿⣶⣶⣿⣷⠄⠄⠄⠄⠄⠄⠄⠄⠈⠔⡑⠕⠝⠄⡀⠄⠄⠊⢆⠂⠨⡪⣺⣮⣿⡾⡜⣜⡜⣄⠙⢞⣿⢿⡿⣗⢝⢸⣾⣿⣿⣿
      ⣿⣿⣿⣿⣿⣿⣿⣿⠄⠄⠄⠄⠄⡀⠄⠄⠄⠄⢀⠄⠠⠄⠠⠄⠄⠄⠄⠄⠄⠊⠺⡹⠳⡙⡜⡓⡭⡺⡀⠄⠣⡻⡹⡸⠨⣣⣿⣿⣿⣿
      ⣿⣿⣿⣿⣿⣿⣿⣿⠄⠄⠄⠄⠄⠠⠄⠄⣂⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢄⠤⡤⡄⡆⡯⡢⡣⡣⡓⢕⠽⣄⠄⠨⡂⢌⣼⣿⣿⣿⣿⣿
      ⣿⣿⣿⣿⣿⣿⣿⣿⡆⠄⠄⠄⠄⠈⠆⠄⠸⡂⠄⠄⠄⢀⠄⢀⠈⠄⠂⠁⠙⠝⠼⠭⠣⠣⠣⠑⠌⠢⠣⡣⡠⡘⣰⣱⣿⣿⣿⣿⣿⣿
      ⣿⣿⣿⣿⣿⣿⣿⣿⡇⠄⠄⠄⠄⠄⢑⠄⠈⡱⠄⢘⠄⡀⠨⢐⣧⣳⣷⣶⣦⣤⣴⣶⣶⣶⡶⠄⡠⡢⡕⣜⠎⡮⣣⣿⣿⣿⣿⣿⣿⣿
      ⣿⣿⣿⣿⣿⣿⣿⣿⡇⠄⠄⠄⠄⠄⠄⠢⠄⠨⠄⠄⠣⡀⠄⢀⢀⢙⠃⡿⢿⠿⡿⡿⢟⢋⢔⡱⣝⢜⡜⡪⡪⣵⣿⣿⣿⣿⣿⣿⣿⣿
      ⣿⣿⣿⣿⣿⣿⣿⣿⡁⠄⠄⠄⠄⠄⠄⠄⠅⠄⠡⠄⠄⠡⢀⢂⠢⡡⠡⠣⡑⣏⢯⡻⡳⣹⡺⡪⢎⠎⡆⢣⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿
      ⣿⣿⣿⣿⣿⣿⣿⣿⣇⠄⠄⠄⠄⠄⠄⠄⠐⠄⠄⠁⠄⢈⠄⢂⠕⡕⡝⢕⢎⢎⢮⢎⢯⢺⢸⢬⠣⢃⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠠⠨⡐⠌⢆⢇⢧⢭⣣⡳⣵⢫⣳⢱⠱⢑⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣆⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠁⡊⢌⢢⢡⢣⢪⡺⡪⡎⡎⡎⡚⣨⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠕⡅⢗⢕⡳⡭⣳⢕⠕⡱⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠌⠄⠑⠩⢈⢂⣱⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⡀⢄⠄⣀⠄⡀⣀⢠⢄⣖⣖⣞⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿`,
  ]);
  if (
    message.content.toLowerCase().includes("nigga") ||
    message.content.toLowerCase().includes("nigger")
  ) {
    const person = message.author.id;

    nwordModel.get(person, (error, results) => {
      if (error) {
        console.error(error);
      } else {
        if (results === undefined) {
          message.channel.send("ok");
          const newNword = new nwordModel({
            id: person,
            nwordCount: 1,
          });
          newNword.save((error) => {
            if (error) {
              console.error(error);
            } else {
              console.log("fart");
              message.fetch(message.id).then((msg) => msg.delete());
            }
          });
        } else {
          // console.log(results);
          let awesome = results.nwordCount;
          let awesome2 = awesome++; //TODO maybe broken
          console.log(awesome);
          const newNword = new nwordModel({
            id: person,
            nwordCount: awesome,
          });
          newNword.save((error) => {
            if (error) {
              console.error(error);
            } else {
              message.fetch(message.id).then((msg) => msg.delete());
            }
          });
        }
      }
    });
  }
});

client.login(config.bot.token);
