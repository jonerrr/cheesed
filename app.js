const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const db = require("./db.json");
const agroify = require("./agroify");
const mineflayer = require("mineflayer");
const fs = require("fs");
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
  // bot.chat(`/g kick ${config.minecraft.usernameToKick} trollololol cheesed`);
  // setTimeout(() => {
  //   bot.chat(`/g invite ${config.minecraft.usernameToKick}`);
  // }, 3000);
  // console.log("guy just got cheesed in guild");
  message.channel.send("coming soon");
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
    if (!db.whitelistedServerIds.includes(server)) {
      cheeseTotal.whitelistedServerIds.push(server);
      writeToDB();
      message.channel.send("blacklisted server");
    } else {
      message.channel.send("server already blacklisted");
    }
  } else if (command === "unblacklistserver") {
    const serverId = message.guild.id;
    cheeseTotal.whitelistedServerIds.splice(
      cheeseTotal.whitelistedServerIds.findIndex((id) => id === serverId)
    );
    writeToDB();
    message.channel.send("unblacklisted server");
  } else if (command === "cheesg") {
    cheeseGuild();
    message.channel.send("<:emoji:792188874235183155>");
  } else if (command === "n" || command === "nword") {
    const lol = readFromDB();
    const personTagged = message.mentions.members.first();
    if (personTagged) {
      if (
        lol.badPeople[personTagged.id] === undefined ||
        lol.badPeople[personTagged.id] === 0
      ) {
        message.channel.send(
          `<@${personTagged.id}> has not said the nword yet 😎`
        );
      } else if (
        lol.badPeople[personTagged.id] !== undefined ||
        lol.badPeople[personTagged.id] !== 0
      ) {
        message.channel.send(
          `<@${personTagged.id}> has said the nword ${
            lol.badPeople[personTagged.id]
          } times 🙀🙀`
        );
      }
    } else if (!personTagged) {
      if (
        lol.badPeople[message.author.id] === undefined ||
        lol.badPeople[message.author.id] === 0
      ) {
        message.channel.send(
          `<@${message.author.id}> has not said the nword yet 😎`
        );
      } else if (
        lol.badPeople[message.author.id] !== undefined ||
        lol.badPeople[message.author.id] !== 0
      ) {
        message.channel.send(
          `<@${message.author.id}> has said the nword ${
            lol.badPeople[message.author.id]
          } times 🙀🙀`
        );
      }
    }
  } else if (command === "lb") {
    const fart = readFromDB();
    // const cheeseArrayNumbers = Object.values(fart.badPeople);
    //console.log(cheeseArrayIds, cheeseArrayNumbers);
    // const leaderBoardAmount = cheeseArrayNumbers.sort(function (a, b) {
    //   return b - a;
    // });
    const sortable = Object.entries(fart.badPeople)
      .sort(([, a], [, b]) => a - b)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
    console.log(sortable);
    const one = Object.entries(sortable)[Object.entries(sortable).length - 1];
    const two = Object.entries(sortable)[Object.entries(sortable).length - 2];
    const three = Object.entries(sortable)[Object.entries(sortable).length - 3];
    const four = Object.entries(sortable)[Object.entries(sortable).length - 4];
    const five = Object.entries(sortable)[Object.entries(sortable).length - 5];
    const six = Object.entries(sortable)[Object.entries(sortable).length - 6];
    const seven = Object.entries(sortable)[Object.entries(sortable).length - 7];
    const eight = Object.entries(sortable)[Object.entries(sortable).length - 8];
    const nine = Object.entries(sortable)[Object.entries(sortable).length - 9];
    const ten = Object.entries(sortable)[Object.entries(sortable).length - 10];

    const lbEmbed = new Discord.MessageEmbed()
      .setColor("#FFDC00")
      .setTitle("top 10 racisms 🙀🙀😼🙀😼")
      .setThumbnail(
        "https://cdn.discordapp.com/avatars/801873143437983754/7d247a3dfdbe79817391c6d62d135ee7.png?size=256"
      )
      .addFields(
        { name: `1.`, value: `<@${one[0]}> with ${one[1]} nwords` },
        { name: `2.`, value: `<@${two[0]}> with ${two[1]} nwords` },
        { name: `3.`, value: `<@${three[0]}> with ${three[1]} nwords` },
        { name: `4.`, value: `<@${four[0]}> with ${four[1]} nwords` },
        { name: `5.`, value: `<@${five[0]}> with ${five[1]} nwords` },
        { name: `6.`, value: `<@${six[0]}> with ${six[1]} nwords` },
        { name: `7.`, value: `<@${seven[0]}> with ${seven[1]} nwords` },
        { name: `8.`, value: `<@${eight[0]}> with ${eight[1]} nwords` },
        { name: `9.`, value: `<@${nine[0]}> with ${nine[1]} nwords` },
        { name: `10.`, value: `<@${ten[0]}> with ${ten[1]} nwords` }
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
    const lol = readFromDB();
    const person = message.author.id;
    const find = lol.badPeople[person];
    //  console.log(find);
    if (!find || find === undefined) {
      let nwordCount = 0;
      nwordCount++;
      lol.badPeople[person] = nwordCount;
      writeToDB();
    } else {
      let nwordCount = lol.badPeople[person];
      nwordCount++;
      lol.badPeople[person] = nwordCount;
      writeToDB();
      // console.log(nwordCount, "fart");
    }
  }
});

client.login(config.bot.token);
