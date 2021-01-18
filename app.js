const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const agroify = require("./agroify");
const prefix = "!";
const user = config.USER_TO_KICK;
const user2 = config.USER_TO_KICK2;
const gifs =
  "<:emoji:735308015607218279><:emoji:735308015607218279><:emoji:735308015607218279><:emoji:735308015607218279> https://tenor.com/view/youre-your-dumb-gif-18219705 https://tenor.com/view/youre-gif-18325368 https://cdn.discordapp.com/attachments/735022070286778408/758908583840317460/caption.gif https://cdn.discordapp.com/attachments/735022070286778408/758908603507408906/caption.gif";

const whitelistedId = async (authorId) => {
  const whitelistedIds = ["738605862872023048"];
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
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();
  const member = message.guild.members.cache.get(user);
  const member2 = message.guild.members.cache.get(user2);
  if (command === "cheese") {
    if (member && member.kickable) {
      member.kick("GET CHEESED TROLOLOL");
      message.reply(
        "CHEESED TROLOLOLOLOL <:emoji:735308015607218279> https://media.discordapp.net/attachments/735022070286778408/760201509702729768/caption.gif"
      );
      console.log(`cheddar has been cheesed (successful)`);
    } else if (!member) {
      message.reply("HE IS NOT IN THE SERVER ANYMORE 😭😭😭");
      console.log(`cheddar has been cheesed (unsuccessful)`);
    } else if (!member.kickable) {
      message.reply("I DONT HAVE PERMS TO KICK HIM !!! 😭😭😭");
    } else {
      message.reply("I COULDNT FREAKING KICK HIM WTF???");
      console.log(`cheddar has been cheesed (unsuccessful)`);
    }
  }
  if (command === "catfish") {
    if (member2 && member2.kickable) {
      member2.kick("GET CHEESED TROLOLOL");
      message.reply(
        "https://cdn.discordapp.com/attachments/625062074245971979/800532282372653086/unknown.png"
      );
      console.log(`herb has been cheesed (successful)`);
    } else if (!member2) {
      message.reply("HE IS NOT IN THE SERVER ANYMORE 😭😭😭");
      console.log(`herb has been cheesed (unsuccessful)`);
    } else if (!member2.kickable) {
      message.reply("I DONT HAVE PERMS TO KICK her !!! 😭😭😭");
    } else {
      message.reply("I COULDNT FREAKING KICK her WTF???");
      console.log(`herb has been cheesed (unsuccessful)`);
    }
  }
});

client.on("message", function (message) {
  if (message.content.startsWith("agroify")) return agroify.makeFile(message);
  if (message.author.bot) return;
  if (whitelistedId(message.author.id)) return;
  if (message.content.includes("your") || message.content.includes("ur")) {
    message.reply(gifs);
  } else if (message.content.includes(":emoji")) {
    message.channel.send("<:emoji:735308016789749831>:");
  } else if (message.content.includes("jelly")) {
    message.channel.send("🌮");
  }
});
client.login(config.BOT_TOKEN);
