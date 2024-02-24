import { Collection } from "discord.js";

const UrlStore = new Collection();

UrlStore.set("supportServer", "https://discord.gg/z5Br4ewXJ8");
UrlStore.set(
  "inviteURL",
  "https://discord.com/oauth2/authorize?client_id=1210608399914373190&scope=bot&permissions=2150747136"
);

export default UrlStore;
