import { Interaction } from "discord.js";
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

    try {
      return slash.func({ interaction });
    } catch (error) {
      if (error instanceof Error) console.error(error);
    }
  },
};
export default CommandHandler;
