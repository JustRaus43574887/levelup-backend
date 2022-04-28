import { DataSource } from "apollo-datasource";
import { Models } from "../models";
import { GroupCourse } from "../models/GroupCourse";

class GroupCourseAPI extends DataSource {
  private models: Models;

  constructor(models: Models) {
    super();
    this.models = models;
  }

  async adminFindAll(): Promise<GroupCourse[]> {
    return await this.models.GroupCourseModel.find()
      .populate("group")
      .populate({
        path: "course",
        populate: { path: "tasks" },
      });
  }
}

export default GroupCourseAPI;
