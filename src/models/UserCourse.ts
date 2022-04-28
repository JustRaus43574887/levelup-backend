import { Document, model, Schema, Types } from "mongoose";

export interface UserCourse extends Document {
  completed: boolean;
  group: Types.ObjectId;
  course: Types.ObjectId;
}

const schema = new Schema<UserCourse>(
  {
    completed: { type: Boolean, required: true, default: false },
    group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  },
  { timestamps: true }
);

const UserCourseModel = model<UserCourse>("UserCourse", schema);

export default UserCourseModel;
