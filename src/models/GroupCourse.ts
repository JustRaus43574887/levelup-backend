import { Document, model, Schema, Types } from "mongoose";

export interface GroupCourse extends Document {
  group: Types.ObjectId;
  course: Types.ObjectId;
}

const schema = new Schema<GroupCourse>(
  {
    group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  },
  { timestamps: true }
);

const GroupCourseModel = model<GroupCourse>("GroupCourse", schema);

export default GroupCourseModel;
