const Discord = require('discord.js');
const client = new Discord.Client();
const versionjson = require('./package.json');
const db = require('quick.db');
require('dotenv').config();

client.on('ready', () => {
    console.log('Bot prêt !');
    client.user.setActivity(`Version ${versionjson.version}`);
});

client.on('message', async msg => {
    
    let args = msg.content.substring("_".length).split(" ");
    let warnargs = msg.content.substring("_".length).split("  ");

    switch(args[0]){
        case 'bak-ban':
            const target = args[1];
            const reason = warnargs[1];
            let bannedornot = db.get(`${target}_banned`);
            if(!msg.author.id === "499297738370973716" || !msg.author.id === "432116536866766849"){
                return msg.channel.send(':x: Vous n\'avez pas la permission d\'exécuter cette commande !')
            }
            if(!target) {
                return msg.channel.send('Vous devez spécifier un id d\'utilisateur à Bak-Ban ! Utilisation correcte de la commande : _bak-ban [id d\'utilisateur] (deux espaces) [raison]')
            }
            if(!reason) {
                return msg.channel.send('Vous devez spécifier une raison valide ! Utilisation correcte de la commande : _bak-ban [id d\'utilisateur] (deux espaces) [raison]')
            }
            try {
                if (bannedornot === true) {
                    return msg.channel.send("Cet utilisateur est déjà bak-banni!")
                }
                db.set(`${target}_banned`, true);
                db.set(`${target}_banreason`, reason);
                const embedusername = client.users.cache.find(user => user.id === target)
                const dmembed = new Discord.MessageEmbed()
                    .setTitle("Vous avez été banni des serveurs Bak-Ban")
                    .setDescription(`Vous avez été banni pour ${reason}. Si vous voulez faire appel à ce ban, veuillez rejoindre le serveur du support de botty en cliquant [ici](https://discord.gg/ysMuM9NeCs)`)
                    .setColor("#FF0000")
                client.users.fetch(target, false).then((user) => {
                    user.send(dmembed);
                });
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Bak-Ban`)
                    .setDescription(`${embedusername} a été banni des serveurs Bak-Ban pour ${reason}!`)
                    .setColor("#FF0000")
                    .setThumbnail("https://cdn.discordapp.com/emojis/764396593964122132.gif?v=1")
                client.channels.cache.get(`822504298839146592`).send(embed).then(setInterval(function(){client.guilds.cache.forEach(a => a.members.ban(target, ({ reason: reason })));},1500));
                
                
                
                

                
            }catch (error){
                console.error(error)
                msg.channel.send(':x: Une erreur s\'est produite ou l\'ID spécifié est invalide !')
            }
            break;
        case 'isbakbanned':
            const bannedtarget = args[1];

            let yesorno = db.get(`${bannedtarget}_banned`)
            try{
                if (yesorno === null || yesorno === false){
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Status de ban de l'id ${bannedtarget}`)
                        .setDescription(`L'utilisateur avec l'ID ${bannedtarget} **n'est pas banni**.`)
                        .setColor("#00FF00")
                    msg.channel.send(embed)
                };
                if (yesorno === true){
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Status de ban de l'id ${bannedtarget}`)
                        .setDescription(`L'utilisateur avec l'ID ${bannedtarget} **est banni**.`)
                        .setColor("#FF0000")
                    msg.channel.send(embed)
                }

            }catch (error){
                console.error(error)
                msg.channel.send(':x: Une erreur s\'est produite ou l\'ID spécifié est invalide !')
            }
            break;
        case 'unbak-ban':
            const bantarget = args[1];
            let isuserbannedornot = db.get(`${bantarget}_banned`);
            if(!msg.author.id === "499297738370973716" || !msg.author.id === "432116536866766849"){
                return msg.channel.send(':x: Vous n\'avez pas la permission d\'exécuter cette commande !')
            }
            if(!target) {
                return msg.channel.send('Vous devez spécifier un id d\'utilisateur à Bak-Ban ! Utilisation correcte de la commande : _bak-ban [id d\'utilisateur] [raison]')
            }
            if(!reason) {
                return msg.channel.send('Vous devez spécifier une raison valide ! Utilisation correcte de la commande : _bak-ban [id d\'utilisateur] [raison]')
            }
            try {
                if (isuserbannedornot === false || isuserbannedornot === null) {
                    return msg.channel.send("Cet utilisateur n'est pas bak-banni!")
                }
                db.set(`${bantarget}_banned`, false);
                db.set(`${bantarget}_banreason`, null);
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Bak-Ban`)
                    .setDescription(`L'utilisateur avec l'ID ${bantarget} a été débanni des serveurs Bak-Ban!`)
                    .setColor("#00FF00")
                client.channels.cache.get(`822504298839146592`).send(embed).then(setInterval(function(){client.guilds.cache.forEach(a => a.members.unban(bantarget));},1500));
                
                
                
                

                
            }catch (error){
                console.error(error)
                msg.channel.send(':x: Une erreur s\'est produite ou l\'ID spécifié est invalide !')
            }
            break;
        case 'bak-warn':
            if(!msg.author.id === "499297738370973716" || !msg.author.id === "432116536866766849") {
                return msg.channel.send("Vous avez besoin de faire partie de l'équipe botty pour utiliser cette commande !")
            }
            
            if (!msg.member.hasPermission("ADMINISTRATOR")) {
                return msg.channel.send("Vous avez besoin d'être admin sur ce serveur pour utiliser cette commande !")
            }

            const user = msg.mentions.members.first()
              
            if(!user) {
                return msg.channel.send("Veuillez mentionner la personne que vous voulez warn. - warn @mention (deux espaces) <raison>")
            }
              
            if(msg.mentions.users.first().bot) {
                return msg.channel.send("Vous ne pouvez pas warn un bot !")
            }
              
            if(msg.author.id === user.id) {
                return msg.channel.send("Vous ne pouvez pas vous warn vous-même !")
            }
              
            if(user.id === msg.guild.owner.id) {
                return msg.channel.send("Vous ne pouvez pas warn le propriétaire de ce serveur. -_-")
            }
              
            const warnreason = warnargs[1];
              
            if(!warnreason) {
                return msg.channel.send("Veuillez spécifier une raison de warn. - warn @mention (deux espaces) <reason>")
            }
              
            let warnings = db.get(`warnings_${msg.guild.id}_${user.id}`)
              
            if(warnings === 3) {
                return msg.channel.send(`${msg.mentions.users.first().username} à déjà atteint sa limite de 3 warnings !`)
            }
              
            if(warnings === null) {
                db.set(`warnings_${msg.guild.id}_${user.id}`, 1)
                user.send(`Vous avez été warn dans **${msg.guild.name}** par ${msg.author.username}${msg.author.discriminator} pour ${warnreason}`)
                await msg.channel.send(`Vous avez warn **${msg.mentions.users.first().username}** pour ${warnreason}`)
            } else if(warnings !== null) {
                db.add(`warnings_${msg.guild.id}_${user.id}`, 1)
                user.send(`Vous avez été warn dans **${msg.guild.name}** par ${msg.author.username}${msg.author.discriminator} pour ${warnreason}`)
                await msg.channel.send(`Vous avez warn **${msg.mentions.users.first().username}** pour ${warnreason}`)
            }
            break;
        case 'bak-warns':
            const warnsuser = msg.mentions.members.first() || msg.author
    
  
            let warns = db.get(`warnings_${msg.guild.id}_${warnsuser.id}`)
    
    
            if(warns === null) warns = 0;

            if (warnsuser === msg.author){
                msg.channel.send(`Vous avez **${warns}** warn(s)`)
            }else{
                msg.channel.send(`${warnsuser} a **${warns}** warn(s)`)
            }
            break;
        case 'bak-resetwarns':
            if(!msg.author.id === "499297738370973716" || !msg.author.id === "432116536866766849") {
                return msg.channel.send("Vous avez besoin de faire partie de l'équipe botty pour utiliser cette commande !")
            }
            
            if (!msg.member.hasPermission("ADMINISTRATOR")) {
                return msg.channel.send("Vous avez besoin d'être admin sur ce serveur pour utiliser cette commande !")
            }
              
            const resetuser = msg.mentions.members.first()
              
            if(!resetuser) {
              return msg.channel.send("Veuillez mentionner la personne dont vous voulez enlever les warns !")
            }
              
            if(msg.mentions.users.first().bot) {
                return msg.channel.send("Les bots n'ont pas de warns !")
            }
              
            let resetwarnings = db.get(`warnings_${msg.guild.id}_${resetuser.id}`)
              
            if(resetwarnings === null) {
                return msg.channel.send(`${msg.mentions.users.first().username} n'a pas de warns !`)
            }
              
            db.delete(`warnings_${msg.guild.id}_${resetuser.id}`)
            resetuser.send(`Vos warns ont été supprimés par ${msg.author.username} dans ${msg.guild.name}`)
            await msg.channel.send(`Warns de ${msg.mentions.users.first().username} supprimés !`)
              
    }
})

client.login(process.env.TOKEN);