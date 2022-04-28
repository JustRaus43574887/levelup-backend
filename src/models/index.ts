import { Model } from "mongoose";
import CourseModel, { Course } from "./Course";
import DictionaryModel, { Dictionary } from "./Dictionary";
import DictionaryWordModel, { DictionaryWord } from "./DictionaryWord";
import GroupModel, { Group } from "./Group";
import GroupCourseModel, { GroupCourse } from "./GroupCourse";
import TaskModel, { Task } from "./Task";
import UserModel, { User } from "./User";
import UserCourseModel, { UserCourse } from "./UserCourse";

export type Models = {
  CourseModel: Model<Course>;
  DictionaryModel: Model<Dictionary>;
  DictionaryWordModel: Model<DictionaryWord>;
  GroupModel: Model<Group>;
  GroupCourseModel: Model<GroupCourse>;
  TaskModel: Model<Task>;
  UserModel: Model<User>;
  UserCourseModel: Model<UserCourse>;
};

const models: Models = {
  CourseModel,
  DictionaryModel,
  DictionaryWordModel,
  GroupModel,
  GroupCourseModel,
  TaskModel,
  UserModel,
  UserCourseModel,
};

export default models;
