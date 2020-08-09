const ruokaJono = require("../tasks/waiter");
const d = new Date();
const cd = require("../tasks/paivanRuoat.json")
var pm = cd.pvm;


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
        if (pm !== currentDate) {
            ruokaJono.paivitaRuoat();
        }

        let responseBody = `\n__**Päivän ruokalista:**__ (${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()})\n`;
        for (let item of data) {
            responseBody += `\n**${item.ravintola}**\n`;
            item.ruoat = item.ruoat.filter(value => value !== ""); //tyhjennä tyhjät
            for (let i = 0; i < item.ruoat.length; i++) {
                responseBody += `> ${i + 1}. ${item.ruoat[i]}\n`;
            }
            responseBody += "\n";
        }

        return message.reply(responseBody);
    }
};
