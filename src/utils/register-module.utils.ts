import fs from 'fs';
import { Client } from 'discord.js';

const registerEvents = (client: Client) => {
  const moduleFolders = fs.readdirSync(__dirname + '/../modules');

  for (const folder of moduleFolders) {
    const moduleFiles = fs
      .readdirSync(__dirname + `/../modules/./${folder}`)
      .filter((name) => name.includes('handler'));

    for (const file of moduleFiles) {
      const event = require(`../modules/${folder}/${file}`);
      if (event.once) {
        if (event.default) {
          client.once(
            event.default.on,
            async (...args) => await event.default.execute(...args, client)
          );
        }
      } else {
        if (event.default) {
          client.on(
            event.default.on,
            async (...args) => await event.default.execute(...args, client)
          );
        }
      }
    }
  }
};

export default registerEvents;
