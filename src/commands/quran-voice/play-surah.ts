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
import { useMainPlayer } from "discord-player";
import UrlStore from "../../store/urlStore";
import { createAudioResource } from "discord-voip";

const PlaySurah: SlashCommand = {
  name: "sure-dinle",
  id: "sure-dinle",
  category: "voice-quran",

  data: new SlashCommandBuilder()
    .setName("sure-dinle")
    .setDescription("Girmiş olduğunuz sureyi sesli kanalda oynatır.")
    .addNumberOption((option) =>
      option
        .setName("sure-numarası")
        .setDescription(
          "Sesli kanalda oynatılmasını istediğiniz sure numarası."
        )
        .setRequired(true)
        .setMaxValue(114)
        .setMinValue(1)
    ),
  func: async ({ interaction, client }) => {
    try {
      await interaction.deferReply();

      const searchValue = interaction.options.get("sure-numarası");

      const url = `https://api.acikkuran.com/surah/${searchValue?.value}`;

      const response = await axios.get(url);

      const player = useMainPlayer();
      const user = interaction.guild?.members.cache.get(interaction.user.id);

      const voiceChannel = user?.voice.channel;

      if (!voiceChannel) throw new Error("Ses kanalına bağlanılmamış.");

      const {
        data: { audio, name, id, verse_count, zero },
      } = response.data as QuranData;

      const queue = player.nodes.create(interaction.guildId!);

      let resource = createAudioResource(audio.mp3, { inlineVolume: true });

      if (!resource)
        throw new Error("Oynatıcı oluşturulurken bir hata meydana geldi. ");

      if (!queue.connection) {
        await queue.connect(voiceChannel);
      }

      const diyanetUrl = `https://kuran.diyanet.gov.tr/tefsir/sure/${id}-${name}-suresi`;

      const diyanetURLButton = new ButtonBuilder()
        .setLabel("Diyanet")
        .setURL(diyanetUrl)
        .setStyle(ButtonStyle.Link);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        diyanetURLButton
      );

      await queue.node.playRaw(resource);

      const resultEmbed = new EmbedBuilder({
        title: `${name} suresi oynatılıyor...`,
        color: Colors.Yellow,
        description: `${
          zero?.translation?.text ? `**${zero?.translation?.text}...**` : ""
        }\n\n${name} suresi ${voiceChannel} kanalında oynatılmaya başlandı.\n${bar(
          114,
          id
        )}\n⏲️ ${formatSeconds(
          audio.duration
        )} 📝 ${name} Suresi (${id}) :1234: ${verse_count} Ayet 👤 <@${
          interaction.user.id
        }> `,
        footer: {
          text: `🔎 ${interaction.user.username} tarafından kullanıldı...`,
        },
      });

      await interaction.editReply({ embeds: [resultEmbed], components: [row] });

      return;
    } catch (e) {
      console.log(e);
      const discordButton = new ButtonBuilder()
        .setLabel("Destek Sunucusu")
        .setURL(UrlStore.get("supportServer") as string)
        .setStyle(ButtonStyle.Link);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        discordButton
      );

      const noResultEmbed = new EmbedBuilder({
        color: Colors.Red,
        description: `:warning: Bir hata oluştu, lütfen hatayı geliştiricilere bildir. \`\`\`${e.message}\`\`\``,
      });

      interaction.editReply({ embeds: [noResultEmbed], components: [row] });
      return;
    }
  },
};

export default PlaySurah;

const bar = (
  total: number,
  current: number,
  size = 15,
  line = "▬",
  slider = "🔘"
) => {
  if (current > total) {
    const bar = line.repeat(size + 2);
    return [bar];
  } else {
    const percentage = current / total;
    const progress = Math.round(size * percentage);
    const emptyProgress = size - progress;
    const progressText = line.repeat(progress).replace(/.$/, slider);
    const emptyProgressText = line.repeat(emptyProgress);
    const bar = progressText + emptyProgressText;
    return [bar];
  }
};

function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}
