import { DataSource } from "apollo-datasource";
import { Models } from "../models";
import { Group } from "../models/Group";
import { Nullable } from "../types";
import ApolloDatabaseError from "../utils/apolloErrors/ApolloDatabaseError";

type CreateGroupArgs = {
  name: string;
  users?: string[];
  courses?: string[];
};

type UpdateGroupArgs = {
  name: string;
  users?: string[];
  courses?: string[];
  date?: string;
};

// type GroupCourseItem = {
//   course: string;
//   group: string;
//   targetDate?: string;
// };

// type UserCourseItem = {
//   course: string;
//   group: string;
//   completed: boolean;
// };

class GroupAPI extends DataSource {
  private models: Models;

  constructor(models: Models) {
    super();
    this.models = models;
  }

  async findAll(): Promise<Group[]> {
    return await this.models.GroupModel.find()
      .populate("users")
      .populate({
        path: "courses",
        populate: [{ path: "course", populate: "tasks" }, { path: "group" }],
      });
  }

  async adminAutoFindAll(): Promise<Group[]> {
    return await this.models.GroupModel.find();
  }

  async adminFindById(id: string): Promise<Nullable<Group>> {
    return await this.models.GroupModel.findById(id)
      .populate("users")
      .populate({
        path: "courses",
        populate: [{ path: "course", populate: "tasks" }, { path: "group" }],
      });
  }

  async adminFindByName(name: string): Promise<Nullable<Group>> {
    return await this.models.GroupModel.findOne({ name });
  }

  async adminCreateGroup(args: CreateGroupArgs): Promise<Group> {
    const group = new this.models.GroupModel(args);

    if (args.users) {
      await this.models.GroupModel.updateMany(
        { users: { $in: args.users } },
        { $pullAll: { users: args.users } }
      );

      await this.models.UserModel.updateMany(
        { _id: { $in: args.users } },
        { group: group.id },
        { arrayFilters: [{ "elem._id": { $in: args.users } }] }
      );
    }

    if (args.courses) {
      const groupCourses = await this.models.GroupCourseModel.create(
        args.courses.map((c) => ({ course: c, group: group.id }))
      );
      if (!groupCourses) throw new ApolloDatabaseError();
      group.set(
        "courses",
        groupCourses.map((c) => c.id)
      );

      if (args.users) {
        const userCourses = await this.models.UserCourseModel.create(
          args.courses.map((c) => ({ course: c, group: group.id }))
        );
        if (!userCourses) throw new ApolloDatabaseError();
        await this.models.UserModel.updateMany(
          { _id: { $in: args.users } },
          { courses: userCourses.map((c) => c.id) },
          { arrayFilters: [{ "elem._id": { $in: args.users } }] }
        );
      }
    }

    await group.save();
    return group.populate("users").then((g) =>
      g.populate({
        path: "courses",
        populate: [{ path: "course", populate: "tasks" }, { path: "group" }],
      })
    );
  }

  async adminUpdateGroup(
    id: string,
    args: UpdateGroupArgs
  ): Promise<Nullable<Group>> {
    const oldGroup = await this.models.GroupModel.findById(id);
    if (!oldGroup) throw new ApolloDatabaseError();

    if (args.users) {
      await this.models.GroupModel.updateMany(
        { users: { $in: args.users } },
        { $pullAll: { users: args.users } }
      );

      await this.models.UserModel.updateMany(
        { _id: { $in: oldGroup.users } },
        { group: null },
        { arrayFilters: [{ "elem._id": { $in: oldGroup.users } }] }
      );
      await this.models.UserModel.updateMany(
        { _id: { $in: args.users } },
        { group: oldGroup.id },
        { arrayFilters: [{ "elem._id": { $in: args.users } }] }
      );
    }

    if (args.courses) {
      await this.models.GroupCourseModel.deleteMany({ group: oldGroup.id });
      const groupCourses = await this.models.GroupCourseModel.create(
        args.courses.map((c) => ({ course: c, group: oldGroup.id }))
      );
      if (!groupCourses) throw new ApolloDatabaseError();

      if (args.users) {
        await this.models.UserCourseModel.deleteMany({ group: oldGroup.id });
        const userCourses = await this.models.UserCourseModel.create(
          args.courses.map((c) => ({ course: c, group: oldGroup.id }))
        );
        if (!userCourses) throw new ApolloDatabaseError();
        await this.models.UserModel.updateMany(
          { _id: { $in: args.users } },
          { courses: userCourses.map((c) => c.id) },
          { arrayFilters: [{ "elem._id": { $in: args.users } }] }
        );
      }
      args.courses = groupCourses.map((c) => c.id);
    }

    const updatedGroup = await this.models.GroupModel.findByIdAndUpdate(
      oldGroup.id,
      args
    );
    if (!updatedGroup) throw new ApolloDatabaseError();

    return updatedGroup.populate("users").then((g) =>
      g.populate({
        path: "courses",
        populate: [{ path: "course", populate: "tasks" }, { path: "group" }],
      })
    );
  }

  async adminDeleteGroups(ids: string[]): Promise<Nullable<string[]>> {
    const result = await this.models.GroupModel.deleteMany({
      _id: { $in: ids },
    });
    if (result.deletedCount !== ids.length) throw new ApolloDatabaseError();
    return ids;
  }
}

export default GroupAPI;
