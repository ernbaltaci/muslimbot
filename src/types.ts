import {
  ApplicationCommandSubCommandData,
  Client,
  ClientEvents,
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

interface SlashCommandExecution {
  interaction: CommandInteraction;
  client?: Client;
}
export interface DiscordEvent {
  id: string;
  on: keyof ClientEvents;
  once?: boolean;
  execute: (...arguments_: any[]) => Promise<void> | void;
}

interface SlashCommand {
  name: string;
  id: string;
  category: string | null;
  data: SlashCommandBuilder & any;
  func: ({ client, interaction }: SlashCommandExecution) => Promise<void & any>;
}

interface Verse {
  id: number;
  surah_id: number;
  verse_number: number;
  verse: string;
  page: number;
  juz_number: number;
  transcription: string;
  translation: Translation;
}

interface Translation {
  id: number;
  text: string;
  author: Author;
  footnotes: Footnote[] | null;
}

interface Author {
  id: number;
  name: string;
  description: string;
  language: string;
}

interface Footnote {
  id: number;
  text: string;
  number: number;
}

interface Surah {
  id: number;
  name: string;
  slug: string;
  verse_count: number;
  page_number: number;
  audio: Audio;
  zero: Zero;
  verses: Verse[];
}

interface Audio {
  mp3: string;
  duration: number;
}

interface Zero {
  id: number;
  surah_id: number;
  verse_number: number;
  verse: string;
  page: number;
  juz_number: number;
  transcription: string;
  translation: Translation;
}

interface QuranData {
  data: Surah;
}

export { SlashCommand, QuranData };
