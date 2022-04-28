import { Schema, model, Document, Types } from "mongoose";
import GroupCourseModel from "./GroupCourse";
import TaskModel from "./Task";
import UserCourseModel from "./UserCourse";

export interface Course extends Document {
  name: string;
  tasks: Types.ObjectId[];
}

const schema = new Schema<Course>(
  {
    name: { type: String, required: true, unique: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task", required: true }],
  },
  { timestamps: true }
);

schema.pre("deleteMany", async function (next) {
  const docs = await this.model.find(this.getFilter());
  const taskIds = docs.flatMap((item) => item.tasks);
  const courseIds = docs.map((item) => item.id);
  await GroupCourseModel.deleteMany({ course: courseIds }).exec();
  await UserCourseModel.deleteMany({ course: courseIds }).exec();
  await TaskModel.deleteMany({ id: taskIds }).exec();
  next();
});

const CourseModel = model<Course>("Course", schema);

export default CourseModel;
