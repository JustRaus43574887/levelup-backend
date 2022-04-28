import { DataSource } from "apollo-datasource";
import { ADMIN_LOGIN } from "..";
import { Models } from "../models";
import { User } from "../models/User";
import { Nullable } from "../types";
import ApolloDatabaseError from "../utils/apolloErrors/ApolloDatabaseError";

class UserAPI extends DataSource {
  private models: Models;

  constructor(models: Models) {
    super();
    this.models = models;
  }

  async findStudentById(id: string): Promise<Nullable<User>> {
    return await this.models.UserModel.findById(id)
      .populate("group")
      .populate({ path: "dictionary", populate: { path: "words" } })
      .populate({
        path: "courses",
        populate: { path: "course", populate: { path: "tasks" } },
      });
  }

  async findUserById(id: string): Promise<Nullable<User>> {
    return await this.models.UserModel.findById(id);
  }

  async adminFindUserById(id: string): Promise<Nullable<User>> {
    return await this.models.UserModel.findById(id).populate("group");
  }

  async findUserByEmail(email: string): Promise<Nullable<User>> {
    return await this.models.UserModel.findOne({ email });
  }

  async adminFindAll(): Promise<User[]> {
    return await this.models.UserModel.find({
      $nor: [{ email: ADMIN_LOGIN }],
    }).populate("group");
  }

  async adminApproveUser(id: string): Promise<Nullable<User>> {
    return await this.models.UserModel.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    );
  }

  async adminDeleteUsers(ids: string[]): Promise<Nullable<string[]>> {
    const result = await this.models.UserModel.deleteMany({
      _id: { $in: ids },
    });
    if (result.deletedCount !== ids.length) throw new ApolloDatabaseError();
    return ids;
  }

  async createUser(user: User): Promise<User> {
    const newUser = new this.models.UserModel(user);
    const dictionary = await this.models.DictionaryModel.create({
      userId: newUser.id,
    });
    newUser.set("dictionary", dictionary.id);
    await newUser.save();
    return newUser;
  }

  async adminCreateUser(user: User): Promise<User> {
    const newUser = new this.models.UserModel(user);
    const dictionary = await this.models.DictionaryModel.create({});
    newUser.set("dictionary", dictionary.id);

    if (user.group) {
      const group = await this.models.GroupModel.findByIdAndUpdate(user.group, {
        $push: { users: newUser.id },
      });
      if (!group) throw new ApolloDatabaseError();
      const groupCourse = await this.models.GroupCourseModel.find({
        group: group.id,
      });
      const userCourse = await this.models.UserCourseModel.create(
        groupCourse.map((c) => ({ course: c.course, group: group.id }))
      );
      newUser.set(
        "courses",
        userCourse.map((c) => c.id)
      );
    }

    await newUser.save();
    return newUser.populate("group");
  }

  async updatePassword(id: string, password: string): Promise<Nullable<User>> {
    return await this.models.UserModel.findByIdAndUpdate(
      id,
      { password },
      { new: true }
    );
  }

  async updateUser(id: string, user: User): Promise<Nullable<User>> {
    return await this.models.UserModel.findByIdAndUpdate(
      id,
      { ...user },
      { new: true }
    );
  }

  async adminUpdateUser(id: string, user: User): Promise<Nullable<User>> {
    const oldUser = await this.models.UserModel.findById(id);
    if (!oldUser) throw new ApolloDatabaseError();
    if (user.group) {
      await this.models.GroupModel.findByIdAndUpdate(oldUser.group, {
        $pull: { users: oldUser.id },
      });
      const group = await this.models.GroupModel.findByIdAndUpdate(user.group, {
        $push: { users: id },
      });
      if (!group) throw new ApolloDatabaseError();
      const groupCourse = await this.models.GroupCourseModel.find({
        group: group.id,
      });
      await this.models.UserCourseModel.deleteMany({ group: group.id });
      const userCourse = await this.models.UserCourseModel.create(
        groupCourse.map((c) => ({ course: c.course, group: group.id }))
      );
      user.courses = userCourse.map((c) => c.id);
    }

    const updatedUser = await this.models.UserModel.findByIdAndUpdate(
      oldUser.id,
      user
    );
    if (!updatedUser) throw new ApolloDatabaseError();

    return updatedUser.populate("group");
  }
}

export default UserAPI;
