const Discord = require('discord.js');
const client = new Discord.Client();
const versionjson = require('./package.json');
const db = require('quick.db');
require('dotenv').config();

client.on('ready', () => {
    console.log('Bot prêt !');
    client.user.setActivity(`Version ${versionjson.version}`);
});

client.on('message', msg => {
    
    let args = msg.content.substring("_".length).split(" ");

    switch(args[0]){
        case 'bak-ban':
            const target = args[1];
            const reason = args[2];
            let bannedornot = db.get(`${target}_banned`);
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
            const target = args[1];

            let yesorno = db.get(`${target}_banned`)
            try{
                if (yesorno === null || yesorno === false){
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Status de ban de l'id ${target}`)
                        .setDescription(`L'utilisateur avec l'ID ${target} **n'est pas banni**.`)
                        .setColor("#00FF00")
                    msg.channel.send(embed)
                };
                if (yesorno === true){
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Status de ban de l'id ${target}`)
                        .setDescription(`L'utilisateur avec l'ID ${target} **est banni**.`)
                        .setColor("#FF0000")
                    msg.channel.send(embed)
                }

            }catch (error){
                console.error(error)
                msg.channel.send(':x: Une erreur s\'est produite ou l\'ID spécifié est invalide !')
            }
            break;
        case 'unbak-ban':
            const target = args[1];
            let bannedornot = db.get(`${target}_banned`);
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
                if (bannedornot === false || bannedornot === null) {
                    return msg.channel.send("Cet utilisateur n'est pas bak-banni!")
                }
                db.set(`${target}_banned`, false);
                db.set(`${target}_banreason`, null);
                const embedusername = client.users.cache.find(user => user.id === target)
                const dmembed = new Discord.MessageEmbed()
                    .setTitle("Vous avez été débanni des serveurs Bak-Ban")
                    .setDescription(`Vous avez été débanni.`)
                    .setColor("#00FF00")
                client.users.fetch(target, false).then((user) => {
                    user.send(dmembed);
                });
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Bak-Ban`)
                    .setDescription(`L'utilisateur avec l'ID ${target} a été débanni des serveurs Bak-Ban!`)
                    .setColor("#00FF00")
                client.channels.cache.get(`822504298839146592`).send(embed).then(setInterval(function(){client.guilds.cache.forEach(a => a.members.unban(target));},1500));
                
                
                
                

                
            }catch (error){
                console.error(error)
                msg.channel.send(':x: Une erreur s\'est produite ou l\'ID spécifié est invalide !')
            }
    }
})

client.login(process.env.TOKEN);