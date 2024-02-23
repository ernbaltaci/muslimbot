import { ObjectId, Schema, model, Document } from "mongoose";

interface guildDoc extends Document {
  _id: ObjectId;

  discordId: string;
}

const guildSchema = new Schema({
  discordId: { type: String, required: true },
});

const guildModel = model<guildDoc>("guild", guildSchema);

const findOrCreateGuild = async (discordId: string) => {
  const guild = await guildModel.findOne({ discordId });

  if (guild) return guild;

  const createdGuild = await guildModel.create({
    discordId,
  });

  return createdGuild;
};

export { guildModel, findOrCreateGuild };
