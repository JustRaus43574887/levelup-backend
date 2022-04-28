import { DataSource } from "apollo-datasource";
import { Models } from "../models";
import { Course } from "../models/Course";
import { Task } from "../models/Task";
import { UserCourse } from "../models/UserCourse";
import ApolloDatabaseError from "../utils/apolloErrors/ApolloDatabaseError";

class UserCourseAPI extends DataSource {
  private models: Models;

  constructor(models: Models) {
    super();
    this.models = models;
  }

  async userCompleteCourse(id: string, userId: string): Promise<UserCourse> {
    const user = await this.models.UserModel.findById(userId);
    if (!user) throw new ApolloDatabaseError();
    const userCourse = await this.models.UserCourseModel.findOneAndUpdate(
      { id },
      { completed: true },
      { new: true }
    ).populate({
      path: "course",
      populate: { path: "tasks" },
    });
    if (!userCourse) throw new ApolloDatabaseError();

    const course = userCourse.course as unknown as Course;
    const tasks = course.tasks as unknown as Task[];
    const dictionaryWords = await this.models.DictionaryWordModel.insertMany(
      tasks.map((t) => ({
        word: t.answer,
        translation: t.answer,
        expiredAt: new Date().toISOString(),
        audioPath: t.answer,
      }))
    );

    console.log(user.dictionary);

    const dictionary = await this.models.DictionaryModel.findByIdAndUpdate(
      user.dictionary,
      {
        words: dictionaryWords.map((d) => d._id),
      }
    );

    if (!dictionary) throw new ApolloDatabaseError();

    return userCourse;
  }
}

export default UserCourseAPI;
