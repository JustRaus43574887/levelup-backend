import { Document, model, Schema } from "mongoose";

export interface DictionaryWord extends Document {
  word: string;
  translation: string;
  expiredAt: string;
  audioPath: string;
}

const schema = new Schema<DictionaryWord>(
  {
    word: { type: String, required: true },
    translation: { type: String, required: true },
    expiredAt: { type: String, required: true },
    audioPath: { type: String, required: true },
  },
  { timestamps: true }
);

const DictionaryWordModel = model<DictionaryWord>("DictionaryWord", schema);

export default DictionaryWordModel;
