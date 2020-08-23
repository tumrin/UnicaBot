
const ruokaJono = require("../tasks/waiter.js");
const d = new Date();
var cd = require("../paivanRuoat.json");
var pvm = cd[0].pvm;
const channel = "general"

module.exports = {
  name: "ruokalista",
  aliases: ["ruoka"],
  args: false,
  cooldown: 20,

  description:
    "näyttää päivän ruokalistan assarilta, galileista ja/tai macciksesta",
  execute(message, args) {
    const data = ruokaJono.annaRuoat();
    let currentDate = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
    console.log(pvm);
    console.log(currentDate);
    if (pvm !== currentDate) {
      ruokaJono.paivitaRuoat();
    }
    let responseBody = `\n__**Päivän ruokalista:**__ (${currentDate})\n`;
    for (let item of data) {
      responseBody += `\n**${item.ravintola}**\n`;
      item.ruoat = item.ruoat.filter((value) => value !== ""); //tyhjennä tyhjät
      for (let i = 0; i < item.ruoat.length; i++) {
        responseBody += `> ${i + 1}. ${item.ruoat[i]}\n`;
      }
      responseBody += "\n";
      if (responseBody.includes("kievin") || responseBody.includes("Kievin")) {
        kievinKana(message, item.ravintola);
      }
    }

    return message.reply(responseBody);
  },
};

function kievinKana(message, sijainti) {
  message.reply(":rotating_light: Kievin kana havaittu ravintolassa: " + sijainti + ":rotating_light:", {
    files: [
      "Video/kievinkana.mp4"
    ]
  });
}
