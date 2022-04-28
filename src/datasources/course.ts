import { DataSource } from "apollo-datasource";
import { Models } from "../models";
import { Course } from "../models/Course";
import { TaskType } from "../models/Task";
import { Nullable } from "../types";
import ApolloDatabaseError from "../utils/apolloErrors/ApolloDatabaseError";

type TaskItem = {
  type: TaskType;
  question: string;
  answer: string;
  task: string;
};

class CourseAPI extends DataSource {
  private models: Models;

  constructor(models: Models) {
    super();
    this.models = models;
  }

  async findAll(): Promise<Course[]> {
    return this.models.CourseModel.find().populate("tasks");
  }

  async adminFindById(id: string): Promise<Nullable<Course>> {
    return this.models.CourseModel.findById(id).populate("tasks");
  }

  async adminFindByName(name: string): Promise<Nullable<Course>> {
    return this.models.CourseModel.findOne({ name });
  }

  async adminCreateCourse(name: string, tasks: TaskItem[]): Promise<Course> {
    const course = new this.models.CourseModel({ name });
    const newTasks = await this.models.TaskModel.create(
      tasks.map((t) => ({ ...t, course: course.id }))
    );
    course.set(
      "tasks",
      newTasks.map((t) => t.id)
    );
    await course.save();
    return course.populate("tasks");
  }

  async adminUpdateCourse(
    id: string,
    name: string,
    tasks: TaskItem[]
  ): Promise<Course> {
    const course = await this.models.CourseModel.findById(id);
    if (!course) throw new ApolloDatabaseError();

    await this.models.TaskModel.deleteMany({ course: course.id });
    const newTasks = await this.models.TaskModel.create(
      tasks.map((t) => ({ ...t, course: course.id }))
    );

    const updatedCourse = await this.models.CourseModel.findByIdAndUpdate(
      course.id,
      { name, tasks: newTasks.map((t) => t.id) }
    );
    if (!updatedCourse) throw new ApolloDatabaseError();

    return updatedCourse.populate("tasks");
  }

  async adminDeleteCourses(ids: string[]): Promise<string[]> {
    const result = await this.models.CourseModel.deleteMany({
      _id: { $in: ids },
    });
    if (result.deletedCount !== ids.length) throw new ApolloDatabaseError();
    return ids;
  }
}

export default CourseAPI;
