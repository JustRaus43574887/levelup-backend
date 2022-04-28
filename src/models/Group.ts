import { Document, Schema, Types, model } from "mongoose";
import GroupCourseModel from "./GroupCourse";
import UserModel from "./User";
import UserCourseModel from "./UserCourse";

export interface Group extends Document {
  name: string;
  users: Types.ObjectId[];
  courses: Types.ObjectId[];
}

const schema = new Schema<Group>(
  {
    name: { type: String, required: true, unique: true },
    users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    courses: [
      { type: Schema.Types.ObjectId, ref: "GroupCourse", required: true },
    ],
  },
  { timestamps: true }
);

schema.pre("deleteMany", async function (next) {
  const docs = await this.model.find(this.getFilter());
  const groupIds = docs.map((item) => item.id);
  const userIds = docs.flatMap((item) => item.users);
  const courseIds = docs.flatMap((item) => item.courses);
  await UserCourseModel.deleteMany({ group: groupIds }).exec();
  await UserModel.updateMany(
    { _id: { $in: userIds } },
    { group: null, $set: { courses: [] } },
    { arrayFilters: [{ "elem._id": { $in: userIds } }] }
  ).exec();
  await GroupCourseModel.deleteMany({ id: courseIds }).exec();
  next();
});

const GroupModel = model<Group>("Group", schema);

export default GroupModel;
