import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  ComponentType,
  EmbedBuilder,
  SelectMenuBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { SlashCommand } from "../../types";
import { useMainPlayer } from "discord-player";
import UrlStore from "../../store/urlStore";
import { createAudioResource } from "discord-voip";

const PlayRadio: SlashCommand = {
  name: "radyo-dinle",
  id: "radyo-dinle",
  category: "voice-quran",

  data: new SlashCommandBuilder()
    .setName("radyo-dinle")
    .setDescription("Girmiş olduğunuz ilahi radyosunu sesli kanalda oynatır."),

  func: async ({ interaction, client }) => {
    const radioList = [
      {
        name: "Gözyaşı FM",
        url: "https://rdfm.net/live?url=http://yayin2.canliyayin.org:8700/;*.mp3?&tkn=irnHJsb_dJ73qsjn-spzNg&expires=1710146761&gozyasi-fm",
      },
      {
        name: "Radyo En Konya",
        url: "https://rdfm.net/live?url=http://yayin2.canliyayin.org:7222/;*.mp3?&tkn=fp1MaFgCG0U6n5GRPGSapw&expires=1710147248&radyo-en-konya",
      },
      {
        name: "Dost FM",
        url: "https://dost.stream.emsal.im/fm/;",
      },
      {
        name: "Berat FM",
        url: "https://sslyayin.netyayin.net/3442/stream",
      },
      {
        name: "Mesaj FM",
        url: "https://yayin1.canlitv.day:8010/stream",
      },
      {
        name: "Enderun FM",
        url: "https://rdfm.net/live?url=http://yayin2.canliyayin.org:7052/;*.mp3?&tkn=czAbDaqinOfOkIs4B1Ns0g&expires=1710147666&enderun-fm",
      },
    ];

    try {
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("islamicRadio")
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder("Radyo Seçimi")
        .addOptions([
          {
            label: "Gözyaşı FM",
            value: "Gözyaşı FM",
          },
          {
            label: "Radyo En Konya",
            value: "Radyo En Konya",
          },
          {
            label: "Dost FM",
            value: "Dost FM",
          },
          {
            label: "Berat FM",
            value: "Berat FM",
          },
          {
            label: "Mesaj FM",
            value: "Mesaj FM",
          },

          {
            label: "Enderun FM",
            value: "Enderun FM",
          },
        ]);

      const actionRow = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
        selectMenu
      );

      const message = await interaction.reply({
        components: [actionRow],
      });

      const collector = message.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        filter: (i) => i.user.id === interaction.user.id,
        time: 15000,
      });

      collector.on("collect", async (interaction) => {
        const selectedValues = interaction.values;
        const selectedValue = selectedValues[0];

        const player = useMainPlayer();

        const queue = player.nodes.create(interaction.guildId!);

        const radioURL = radioList.filter(
          (value) => value.name === selectedValue
        )[0].url;

        let resource = createAudioResource(radioURL, { inlineVolume: true });

        const user = interaction.guild?.members.cache.get(interaction.user.id);
        if (!resource)
          throw new Error("Oynatıcı oluşturulurken bir hata meydana geldi. ");

        const voiceChannel = user?.voice.channel;
        if (!voiceChannel) throw new Error("Ses kanalına bağlanılmamış.");

        if (!queue.connection) {
          await queue.connect(voiceChannel);
        }

        await queue.node.playRaw(resource);

        await interaction.reply({
          content: `${interaction.user}, seçtiğiniz radyo \`${selectedValue}\` oynatılmaya başlıyor...`,
        });
      });

      collector.on("end", async (collected) => {
        message.delete();
      });
    } catch (error) {
      const discordButton = new ButtonBuilder()
        .setLabel("Destek Sunucusu")
        .setURL(UrlStore.get("supportServer") as string)
        .setStyle(ButtonStyle.Link);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        discordButton
      );

      const noResultEmbed = new EmbedBuilder({
        color: Colors.Red,
        description: `:warning: Bir hata oluştu, lütfen hatayı geliştiricilere bildir. \`\`\`${error.message}\`\`\``,
      });

      interaction.editReply({ embeds: [noResultEmbed], components: [row] });
      return;
    }
  },
};

export default PlayRadio;
