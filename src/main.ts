import { Client, GatewayIntentBits } from "discord.js";

import registerCommands from "./utils/register-command.utils";
import registerModule from "./utils/register-module.utils";
import { connectMongo } from "./lib/connect";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.on("ready", async (client) => {
  console.log(`${client.user!.username} running. (${process.env.NODE_ENV})`);
});

const startProject = async () => {
  connectMongo();

  registerCommands();

  registerModule(client);

  await client.login();
};

startProject();
