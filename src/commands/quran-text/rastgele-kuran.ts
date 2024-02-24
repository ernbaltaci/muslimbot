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

const RastgeleKuran: SlashCommand = {
  name: "rastgele-ayet",
  id: "rastgele-ayet",
  category: "text-quran",

  data: new SlashCommandBuilder()
    .setName("rastgele-ayet")
    .setDescription("Kuran-ı Kerim'den rastgele ayet gösterir."),
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

    try {
      const apiUrl = `https://api.acikkuran.com/surah/${getRandomNumber(
        0,
        114
      )}`;

      const response = await axios.get(apiUrl);

      if (!response) {
        interaction.editReply({ embeds: [noResultEmbed] });
        return;
      }

      const quranData = response.data as QuranData;

      const randomVerseNumber = getRandomNumber(
        1,
        quranData.data.verses.length
      );

      const verse = quranData.data.verses[randomVerseNumber];
      const diyanetUrl = `https://kuran.diyanet.gov.tr/tefsir/${quranData.data.name}-suresi/${verse.id}/ayet`;

      const diyanetURLButton = new ButtonBuilder()
        .setLabel("Diyanet")
        .setURL(diyanetUrl)
        .setStyle(ButtonStyle.Link);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        diyanetURLButton
      );

      const resultEmbed = new EmbedBuilder({
        title: `${quranData.data.name} Suresi ${verse.verse_number}. Ayet (${quranData.data.id}:${verse.verse_number})`,
        color: Colors.Yellow,
        description: `**${
          quranData.data.zero.translation?.text ?? ""
        }** \n\n\`\`\`${verse.translation?.text}\`\`\``,
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

export default RastgeleKuran;

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
