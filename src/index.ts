import { ShardingManager } from "discord.js";
import dotenv from "dotenv";
import path from "path";

const version = process.env.NODE_ENV;

if (version === "production") {
  dotenv.config({ path: path.resolve(__dirname, "../.env.production") });
} else {
  dotenv.config({ path: path.resolve(__dirname, "../.env.development") });
}

if (version === "production") {
  const shardManager = new ShardingManager(__dirname + `/main.js`, {
    token: process.env.DISCORD_TOKEN,
  });

  shardManager.on("shardCreate", (shard) => {
    console.log(`[ShardManager] Shard #${shard.id} created!`);

    shard.on("error", (error) => {
      console.log(`[ShardManager] Shard #${shard.id} ERROR: ${error}`);
    });
    shard.on("death", () => {
      console.log(`[ShardManager] Shard #${shard.id} DEATH`);
    });
  });

  shardManager.spawn({ amount: 1, timeout: -1, delay: 10000 });
} else {
  import("./main");
}
