const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const db = require("./db.json");
const agroify = require("./agroify");
const mineflayer = require("mineflayer");
const fs = require("fs");
const { DH_CHECK_P_NOT_SAFE_PRIME } = require("constants");
const cheeseTotal = {
  total: db.total,
  whitelistedServerIds: db.whitelistedServerIds,
  badPeople: db.badPeople,
};
//lol im not using a database too lazy
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
  return Math.floor(randomNum);
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
  return obj;
}

// const whitelistedId = async (authorId) => {
//   const whitelistedIds = config.bot.whitelistedIds;
//   if (whitelistedIds.includes(authorId)) return true;

//   return false;
// };

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
          writeToDB();
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
      `captaincheddar has been cheesed ${db.total} times <:emoji:735308015607218279>`
    );
  } else if (command === "blacklistserver") {
    const server = message.guild.id;
    if (!db.whitelistedServerIds.includes(server)) {
      cheeseTotal.whitelistedServerIds.push(server);
      writeToDB();
      message.channel.send("blacklisted server");
    } else {
      message.channel.send("server already blacklisted");
    }
    //console.log(server);
  } else if (command === "unblacklistserver") {
    const serverId = message.guild.id;
    cheeseTotal.whitelistedServerIds.splice(
      cheeseTotal.whitelistedServerIds.findIndex((id) => id === serverId)
    );
    writeToDB();
    message.channel.send("unblacklisted server");
  } else if (command === "cheesg") {
    cheeseGuild();
    message.channel.send("<:emoji:735308015607218279>");
  } else if (command === "n" || command === "nword") {
    try {
      const lol = readFromDB();
      const personTagged = message.mentions.members.first().id;
      const id = message.author.id;
      if (personTagged) {
        if (
          lol.badPeople[personTagged] === undefined ||
          lol.badPeople[personTagged] === 0
        ) {
          message.channel.send(
            `<@${personTagged}> has not said the nword yet 😎`
          );
        } else if (
          lol.badPeople[personTagged] !== undefined ||
          lol.badPeople[personTagged] !== 0
        ) {
          message.channel.send(
            `<@${personTagged}> said the nword ${db.badPeople[personTagged]} times 🙀🙀`
          );
        }
      }
    } catch (error) {
      message.channel.send("stopped stupid fucking shit from crashing bot");
      console.log("error with event trolol");
    }
  } else if (command === "lb") {
    const cheeseArrayNumbers = Object.values(cheeseTotal.badPeople);
    //console.log(cheeseArrayIds, cheeseArrayNumbers);
    const test = cheeseArrayNumbers.sort(function (a, b) {
      return b - a;
    });
    const lbEmbed = new Discord.MessageEmbed()
      .setColor("#FFDC00")
      .setTitle("top 10 racisms 🙀🙀😼🙀😼")
      .setThumbnail(
        "https://cdn.discordapp.com/avatars/801873143437983754/7d247a3dfdbe79817391c6d62d135ee7.png?size=256"
      )
      .addFields(
        { name: `1`, value: `${test[0]}` },
        { name: `2`, value: `${test[1]}` },
        { name: `3`, value: `${test[2]}` },
        { name: `4`, value: `${test[3]}` },
        { name: `5`, value: `${test[4]}` },
        { name: `6`, value: `${test[5]}` },
        { name: `7`, value: `${test[6]}` },
        { name: `8`, value: `${test[7]}` },
        { name: `9`, value: `${test[8]}` },
        { name: `10`, value: `${test[9]}` }
      )
      .setFooter(
        "made by jonah",
        "https://cdn.discordapp.com/avatars/738605862872023048/a751915cef7f8e6b8e84fc59f141bdc7.png?size=256"
      );
    message.channel.send(lbEmbed);
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
    const find = cheeseTotal.badPeople[person];
    console.log(find);
    if (!find || find === undefined) {
      let nwordCount = 0;
      nwordCount++;
      cheeseTotal.badPeople[person] = nwordCount;
      writeToDB();
      //const nwordTotal = readFromDB();
      //   message.channel.send(`${nwordTotal[person]} cum`);
    } else {
      let nwordCount = cheeseTotal.badPeople[person];
      nwordCount++;
      cheeseTotal.badPeople[person] = nwordCount;
      writeToDB();
      //const nwordTotal = readFromDB();
      console.log(nwordCount, "fart");
      //   message.channel.send(`${nwordTotal[person]} balls`);
    }
  }
});

client.login(config.bot.token);
