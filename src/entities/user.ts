import { ObjectId, Schema, model, Document } from "mongoose";

interface userDoc extends Document {
  _id: ObjectId;

  discordId: string;
}

const userSchema = new Schema({
  discordId: { type: String, required: true },
});

const userModel = model<userDoc>("user", userSchema);

const findOrCreateUser = async (discordId: string) => {
  const user = await userModel.findOne({ discordId });

  if (user) return user;

  const createdUser = await userModel.create({
    discordId,
  });

  return createdUser;
};

export { userModel, findOrCreateUser };
