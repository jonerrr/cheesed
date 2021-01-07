const download = require("download");
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

exports.makeFile = async (msg) => {
  try {
    const imageLink = msg.content.split(" ")[1];
    if (!imageLink.endsWith(".png")) return false;
    if (fs.readdirSync("./images").includes(`${msg.author.id}.png`))
      return false;

    try {
      fs.writeFileSync(
        `./images/${msg.author.id}.png`,
        await download(imageLink)
      );
    } catch (error) {
      msg.reply("The link you sent was bad lmao. get a better link or else.");
    }

    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext("2d");

    const userImage = await loadImage(`./images/${msg.author.id}.png`);
    const agroImage = await loadImage("./agromc/agromc.png");
    ctx.font = "100px Comic Sans MS";
    ctx.fillStyle = "#FF0000";
    ctx.drawImage(userImage, 0, 0, 1920, 1080);
    ctx.drawImage(agroImage, 0, 600, 500, 500);
    ctx.fillText("THIS IS SO SAD", 600, 800);
    ctx.fillText("CAN WE GET 7 LIKES??", 600, 1000);

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(`./editedImages/${msg.author.id}.png`, buffer);

    await msg.reply("**AGROIFIED.**", {
      files: [`./editedImages/${msg.author.id}.png`],
    });

    fs.unlinkSync(`./images/${msg.author.id}.png`);
    fs.unlinkSync(`./editedImages/${msg.author.id}.png`);
  } catch (error) {
    console.log(error);
  }
};
