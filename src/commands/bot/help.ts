import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types";
import axios from "axios";
import CommandStore from "../../store/command-store.store";
import UrlStore from "../../store/urlStore";

const Help: SlashCommand = {
  name: "yardım",
  id: "yardım",
  category: null,

  data: new SlashCommandBuilder()
    .setName("yardım")
    .setDescription("Botun komutları hakkında bilgi verir."),
  func: async ({ interaction, client }) => {
    const commands = CommandStore;

    const commandsArray = [];

    for (const command of commands) {
      const [key, value] = command as any;

      if (!value.off) {
        commandsArray.push({
          category: value?.category,
          commands: `\`/${value?.name}\``,
        });
      }
    }

    const discordButton = new ButtonBuilder()
      .setLabel("Destek Sunucusu")
      .setURL(UrlStore.get("supportServer") as string)
      .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      discordButton
    );

    const resultEmbed = new EmbedBuilder({
      title: `${interaction.client.user.username} - Yardım`,
      color: Colors.Yellow,
      fields: [
        {
          name: `Yazılı Kuran`,
          value: `${commandsArray
            .filter((value) => value.category === "text-quran")
            .map((value) => value.commands)
            .join(", ")}`,
        },
        {
          name: `Sesli Kuran`,
          value: `${commandsArray
            .filter((value) => value.category === "voice-quran")
            .map((value) => value.commands)
            .join(", ")}`,
        },
        {
          name: `Bilgi`,
          value: `${commandsArray
            .filter((value) => value.category === "info")
            .map((value) => value.commands)
            .join(", ")}`,
        },
      ],
      footer: {
        text: `🔎 ${interaction.user.username} tarafından kullanıldı...`,
      },
    });

    interaction.reply({ embeds: [resultEmbed], components: [row] });
    return;
  },
};

export default Help;

const calculateTime = (time: Date) => {
  const now = new Date();
  let timeDiff = time.getTime() - now.getTime();

  if (timeDiff < 0) timeDiff += 86_400_000;

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
  const seconds = Math.floor((timeDiff / 1000) % 60);
  return { hours, minutes, seconds };
};
