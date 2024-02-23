import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import axios from "axios";

const NamazVakitleri: SlashCommand = {
  name: "namaz",
  id: "namaz",
  category: "info",

  data: new SlashCommandBuilder()
    .setName("namaz")
    .setDescription("Namaza kalan vakitleri gösterir")
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
          `${sehir}`
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

      const calculatedFajrTime = calculateTime(
        new Date(`${date} ${prayerTimes.Fajr}`)
      );

      const calculatedDhurTime = calculateTime(
        new Date(`${date} ${prayerTimes.Dhuhr}`)
      );

      const calculatedSunset = calculateTime(
        new Date(`${date} ${prayerTimes.Sunset}`)
      );

      const calculatedMaghribTime = calculateTime(
        new Date(`${date} ${prayerTimes.Maghrib}`)
      );

      const calculatedIshaTime = calculateTime(
        new Date(`${date} ${prayerTimes.Isha}`)
      );

      const resultEmbed = new EmbedBuilder({
        title: `${sehir} - Namaz Vakitleri`,
        color: Colors.Yellow,
        description: `:sunrise: **Sabah Namazı →** ${calculatedFajrTime.hours} Saat ${calculatedFajrTime.minutes} Dakika ${calculatedFajrTime.seconds} Saniye \n\n:sunny: **Öğle Namazı →** ${calculatedDhurTime.hours} Saat ${calculatedDhurTime.minutes} Dakika ${calculatedDhurTime.seconds} Saniye \n\n:white_sun_small_cloud:  **İkindi Namazı →** ${calculatedSunset.hours} Saat ${calculatedSunset.minutes} Dakika ${calculatedSunset.seconds} Saniye \n\n:night_with_stars: **Akşam Namazı →** ${calculatedMaghribTime.hours} Saat ${calculatedMaghribTime.minutes} Dakika ${calculatedMaghribTime.seconds} Saniye \n\n:crescent_moon: **Yatsı Namazı →** ${calculatedIshaTime.hours} Saat ${calculatedIshaTime.minutes} Dakika ${calculatedIshaTime.seconds} Saniye`,
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

export default NamazVakitleri;

const calculateTime = (time: Date) => {
  const now = new Date();
  let timeDiff = time.getTime() - now.getTime();

  if (timeDiff < 0) timeDiff += 86_400_000;

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
  const seconds = Math.floor((timeDiff / 1000) % 60);
  return { hours, minutes, seconds };
};
