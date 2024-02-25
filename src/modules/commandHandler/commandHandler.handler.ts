import { Colors, EmbedBuilder, Interaction, WebhookClient } from "discord.js";
import CommandStore from "../../store/command-store.store";
import { DiscordEvent, SlashCommand } from "../../types";
import { findOrCreateUser } from "../../entities/user";
import { findOrCreateGuild } from "../../entities/guild";

const CommandHandler: DiscordEvent = {
  id: "commandHandler",
  on: "interactionCreate",
  async execute(interaction: Interaction) {
    if (
      !interaction.isChatInputCommand() ||
      !interaction.guild ||
      interaction.user.bot
    )
      return;

    const returnOfInter = async (content: string, ephemeral = true) => {
      await interaction.reply({ content, ephemeral });
    };

    const { commandName } = interaction;

    const slashCollection = CommandStore;

    const slash = slashCollection.get(commandName) as SlashCommand;

    if (!slashCollection.has(commandName) || !slash) {
      return returnOfInter("Command not found!");
    }

    const user = await findOrCreateUser(interaction.user.id);

    if (interaction.guild) {
      const guild = await findOrCreateGuild(interaction.guildId!);
    }

    const channel = new WebhookClient({
      url: "https://discord.com/api/webhooks/1211220855510802493/lQa9VvbXLK6K5rljyOFKAxyECkoF1EEpvjCrQa4QR9ZkmsC18v059M8CfjhEgOO9rUgf",
    });

    const embed = new EmbedBuilder({
      title: `Command used from ${interaction.guild.name}`,
      color: Colors.Aqua,

      fields: [
        {
          name: "Guild Stats",
          value: `**Guild Name:** ${interaction.guild.name} \n **Guild ID:** ${interaction.guildId} \n **Guild Member Count:** ${interaction.guild.memberCount}`,
          inline: true,
        },
        {
          name: "Command Stats",
          value: `**Command Category:** ${slash.category} \n **Command Name:** ${slash.name} `,
          inline: true,
        },
      ],
    });

    channel.send({ embeds: [embed] });

    try {
      return slash.func({ interaction });
    } catch (error) {
      if (error instanceof Error) console.error(error);
    }
  },
};
export default CommandHandler;
