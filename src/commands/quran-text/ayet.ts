import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { QuranData, SlashCommand } from "../../types";
import axios from "axios";
import UrlStore from "../../store/urlStore";

const Ayet: SlashCommand = {
  name: "ayet",
  id: "ayet",
  category: "text-quran",

  data: new SlashCommandBuilder()
    .setName("ayet")
    .setDescription("Kuran-ı Kerim'den rastgele ayet gösterir.")
    .addStringOption((option) =>
      option
        .setName("sure")
        .setDescription("Sure numarası")
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(114)
    )
    .addStringOption((option) =>
      option
        .setName("ayet")
        .setDescription("Ayet numarası")
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(300)
    ),
  func: async ({ interaction, client }) => {
    const discordButton = new ButtonBuilder()
      .setLabel("Destek Sunucusu")
      .setURL(UrlStore.get("supportServer") as string)
      .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      discordButton
    );

    const noResultEmbed = new EmbedBuilder({
      color: Colors.Red,
      description: `:warning: Ayet verilerini çekerken bir hata meydana geldi. Lütfen geliştiriciler ile bu konuyu paylaşın.`,
    });

    const sureValue = interaction.options.get("sure");

    const verseValue = interaction.options.get("ayet");

    try {
      const apiUrl = `https://api.acikkuran.com/surah/${sureValue?.value}/verse/${verseValue?.value}`;

      const response = await axios.get(apiUrl);

      if (!response) {
        interaction.editReply({ embeds: [noResultEmbed] });
        return;
      }

      const quranData = response.data;

      const verse = quranData.data.verses;
      const diyanetUrl = `https://kuran.diyanet.gov.tr/tefsir/${quranData.data.surah.name}-suresi/${quranData.data.id}/ayet`;

      const diyanetURLButton = new ButtonBuilder()
        .setLabel("Diyanet")
        .setURL(diyanetUrl)
        .setStyle(ButtonStyle.Link);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        diyanetURLButton
      );

      const resultEmbed = new EmbedBuilder({
        title: `${quranData.data.surah.name} Suresi ${quranData.data.verse_number}. Ayet (${quranData.data.surah.id}:${quranData.data.verse_number})`,
        color: Colors.Yellow,
        description: `\`\`\`${quranData.data.translation.text}\`\`\``,
        footer: {
          text: `🔎 ${interaction.user.username} tarafından kullanıldı...`,
        },
      });

      interaction.reply({
        embeds: [resultEmbed],
        components: [row],
      });
      return;
    } catch (e) {
      console.log(e);
      interaction.reply({ embeds: [noResultEmbed], components: [row] });
      return;
    }
  },
};

export default Ayet;
