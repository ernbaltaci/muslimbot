import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import axios from "axios";

const IftarArama: SlashCommand = {
  name: "sahur",
  id: "sahur",
  category: "info",

  data: new SlashCommandBuilder()
    .setName("sahur")
    .setDescription("İftara ve sahura kalan vakitleri gösterir")
    .addStringOption((option) =>
      option
        .setName("şehir")
        .setDescription("Görmek istediğiniz şehir.")
        .setRequired(true)
    ),
  func: async ({ interaction, client }) => {
    const searchValue = interaction.options.get("şehir");

    const sehir = searchValue?.value
      ?.toLocaleString()
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const searchEmbed = new EmbedBuilder({
      color: Colors.Green,
      description: `:mag: ${sehir} il/ilçe aranıyor...`,
    });

    const noResultEmbed = new EmbedBuilder({
      color: Colors.Red,
      description: `${sehir} adında il/ilçe bulunamadı.`,
    });

    await interaction.reply({
      content: `${interaction.user}`,
      embeds: [searchEmbed],
    });

    try {
      const response = await axios.get(
        `https://api.aladhan.com/timingsByAddress?address=${encodeURIComponent(
          `${searchValue?.value}`
        )}&country=Turkey&method=13`
      );

      if (!response) {
        interaction.editReply({ embeds: [noResultEmbed] });
        return;
      }

      const prayerTimes = response.data.data.timings;

      const date = `${new Date().getFullYear()}-${
        new Date().getUTCMonth() + 1
      }-${new Date().getUTCDate()}`;

      const fajrTime = new Date(`${date} ${prayerTimes.Fajr}`);
      const maghribTime = new Date(`${date} ${prayerTimes.Maghrib}`);

      const calculatedFajrTime = calculateTime(fajrTime);
      const calculatedMaghribTime = calculateTime(maghribTime);

      const resultEmbed = new EmbedBuilder({
        title: `${sehir} - Sahura Kalan`,
        color: Colors.Yellow,
        description: `**Sahura Kalan (${prayerTimes.Maghrib}) →** ${calculatedMaghribTime.hours} Saat ${calculatedMaghribTime.minutes} Dakika ${calculatedMaghribTime.seconds} Saniye \n\n**İftara Kalan (${prayerTimes.Fajr}) →** ${calculatedFajrTime.hours} Saat ${calculatedFajrTime.minutes} Dakika ${calculatedFajrTime.seconds} Saniye`,
        footer: {
          text: `🔎 ${interaction.user.username} tarafından aratıldı...`,
        },
      });

      interaction.editReply({ embeds: [resultEmbed] });
      return;
    } catch (e) {
      interaction.editReply({ embeds: [noResultEmbed] });
    }
  },
};

export default IftarArama;

const calculateTime = (time: Date) => {
  const now = new Date();
  let timeDiff = time.getTime() - now.getTime();

  if (timeDiff < 0) timeDiff += 86_400_000;

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
  const seconds = Math.floor((timeDiff / 1000) % 60);
  return { hours, minutes, seconds };
};
