
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
    let newDate = new Date();
    let responseBody = `\n__**Päivän ruokalista:**__ (${newDate.getDate()}.${newDate.getMonth() + 1}.${newDate.getFullYear()})\n`;
    for (let item of data) {
      if(item.ravintola.includes("-")){
        console.log("replace");
        item.ravintola = item.ravintola.replace("-", " ");
      }
      responseBody += `\n**${item.ravintola.charAt(0).toUpperCase()+item.ravintola.slice(1)}**\n`;
      item.ruoat = item.ruoat.filter((value) => value !== ""); //tyhjennä tyhjät
      for (let i = 0; i < item.ruoat.length; i++) {
        if (item.ruoat[i].includes("kievin") || item.ruoat[i].includes("Kievin")) {
          responseBody += `:rotating_light: ${i + 1}. ${item.ruoat[i]}:rotating_light:\n`;
          kievinKana(message, item.ravintola);
        }
        else{
          responseBody += `> ${i + 1}. ${item.ruoat[i].charAt(0).toUpperCase()+item.ruoat[i].slice(1)}\n`;
        }
      }
      responseBody += "\n";
    }
    return message.reply(responseBody);
  },
};

function kievinKana(message, sijainti) {
  message.reply(":rotating_light: Kievin kana havaittu ravintolassa: "+sijainti+":rotating_light:", {
    files: [
      "Video/kievinkana.mp4"
    ]
  });
}
