//credit to sully for making this
const download = require("download");
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

exports.makeFile = async (message) => {
  try {
    let extension;
    const imageLink = message.content.split(" ")[1];

    if (imageLink.endsWith(".png")) {
      extension = "png";
    } else if (imageLink.endsWith(".jpg") || imageLink.endsWith(".jpeg")) {
      extension = "jpeg";
    }

    if (
      fs.readdirSync("./images").includes(`${message.author.id}.${extension}`)
    )
      return false;

    try {
      fs.writeFileSync(
        `./images/${message.author.id}.${extension}`,
        await download(imageLink)
      );
    } catch (error) {
      message.reply(
        "The link you sent was bad lmao. get a better link or else."
      );
    }

    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext("2d");

    const userImage = await loadImage(
      `./images/${message.author.id}.${extension}`
    );
    const agroImage = await loadImage("./agromc/agromc.png");

    ctx.font = "100px Comic Sans MS";
    ctx.fillStyle = "#FF0000";
    ctx.drawImage(userImage, 0, 0, 1920, 1080);
    ctx.drawImage(agroImage, 0, 600, 500, 500);
    ctx.fillText("THIS IS SO SAD", 600, 800);
    ctx.fillText("CAN WE GET 7 LIKES??", 600, 1000);

    const buffer = canvas.toBuffer(`image/${extension}`);
    fs.writeFileSync(
      `./editedImages/${message.author.id}.${extension}`,
      buffer
    );
    await message.reply("**AGROIFIED.**", {
      files: [`./editedImages/${message.author.id}.${extension}`],
    });

    fs.unlinkSync(`./images/${message.author.id}.${extension}`);
    fs.unlinkSync(`./editedImages/${message.author.id}.${extension}`);
  } catch (error) {
    console.log(error);
  }
};
