import { Schema, model, Document, Types } from "mongoose";
import DictionaryModel from "./Dictionary";
import GroupModel from "./Group";
import UserCourseModel from "./UserCourse";

export interface User extends Document {
  email: string;
  password: string;
  name: string;
  surname: string;
  avatar: string;
  approved: boolean;
  group?: Types.ObjectId;
  courses: Types.ObjectId[];
  dictionary?: Types.ObjectId;
}

const schema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    avatar: {
      type: String,
      required: true,
      default: "/public/uploads/avatars/default.jpg",
    },
    approved: { type: Boolean, required: true, default: false },
    group: { type: Schema.Types.ObjectId, ref: "Group", required: false },
    courses: [
      { type: Schema.Types.ObjectId, ref: "UserCourse", required: true },
    ],
    dictionary: {
      type: Schema.Types.ObjectId,
      ref: "Dictionary",
      required: false,
    },
  },
  { timestamps: true }
);

schema.pre("deleteMany", async function (next) {
  const docs = await this.model.find(this.getFilter());
  const dictionaryIds = docs.map((item) => item.dictionary);
  const groupIds = docs.map((item) => item.group);
  const userIds = docs.map((item) => item.id);
  const courseIds = docs.flatMap((item) => item.courses);
  await UserCourseModel.deleteMany({ id: courseIds }).exec();
  await GroupModel.updateMany(
    { id: groupIds },
    { $pullAll: { users: userIds } }
  ).exec();
  await DictionaryModel.deleteMany({ id: dictionaryIds }).exec();
  next();
});

const UserModel = model<User>("User", schema);

export default UserModel;
