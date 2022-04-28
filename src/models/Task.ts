import { Document, model, Schema, Types } from "mongoose";

export enum TaskType {
  TRANSLATION = "TRANSLATION",
  PERMUTATION = "PERMUTATION",
  IMAGE = "IMAGE",
  AUDIO = "AUDIO",
}

export interface Task extends Document {
  course: Types.ObjectId;
  type: TaskType;
  question: string;
  answer: string;
  task: string;
}

const schema = new Schema<Task>(
  {
    course: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    task: { type: String, required: true },
  },
  { timestamps: true }
);

const TaskModel = model<Task>("Task", schema);

export default TaskModel;
