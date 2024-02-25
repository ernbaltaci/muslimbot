import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types";
import UrlStore from "../../store/urlStore";

const invite: SlashCommand = {
  name: "davet",
  id: "davet",
  category: null,

  data: new SlashCommandBuilder()
    .setName("davet")
    .setDescription("Botun davet bağlantısını gönderir."),
  func: async ({ interaction, client }) => {
    const discordButton = new ButtonBuilder()
      .setLabel("Destek Sunucusu")
      .setURL(UrlStore.get("supportServer") as string)
      .setStyle(ButtonStyle.Link);

    const inviteButton = new ButtonBuilder()
      .setLabel("Davet Bağlantısı")
      .setURL(UrlStore.get("inviteURL") as string)
      .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      discordButton,
      inviteButton
    );

    const resultEmbed = new EmbedBuilder({
      title: `${interaction.client.user.username} - Davet`,
      color: Colors.Yellow,
      description: `<@${interaction.client.user.id}> ile namaz vakitlerini, iftar sahur vakitlerini görebilir; kurandan ayetler dinleyebilir; kuran meallerine bakabilirsiniz. \nBotu davet etmek için butona basabilirsiniz.`,
      footer: {
        text: `🔎 ${interaction.user.username} tarafından kullanıldı...`,
      },
    });

    interaction.reply({ embeds: [resultEmbed], components: [row] });
    return;
  },
};

export default invite;
