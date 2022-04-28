import { Document, model, Schema, Types } from "mongoose";
import DictionaryWordModel from "./DictionaryWord";

export interface Dictionary extends Document {
  words: Types.ObjectId[];
}

const schema = new Schema<Dictionary>(
  {
    words: [
      { type: Schema.Types.ObjectId, ref: "DictionaryWord", required: true },
    ],
  },
  { timestamps: true }
);

schema.pre("deleteMany", async function (next) {
  const docs = await this.model.find(this.getFilter());
  const wordsIds = docs.flatMap((item) => item.words);
  await DictionaryWordModel.deleteMany({
    id: wordsIds,
  }).exec();
  next();
});

const DictionaryModel = model<Dictionary>("Dictionary", schema);

export default DictionaryModel;
