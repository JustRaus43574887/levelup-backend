import {
  ApolloServerExpressConfig,
  AuthenticationError,
} from "apollo-server-express";
import UserModel, { User } from "../models/User";
import typeDefs from "../schema/typeDefs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "..";
import { ApolloErrorable, Nullable } from "../types";
import resolvers from "../schema/resolvers";
import models from "../models";
import UserAPI from "../datasources/user";
import GroupAPI from "../datasources/group";
import CourseAPI from "../datasources/course";
import GroupCourseAPI from "../datasources/groupCourse";
import UserCourseAPI from "../datasources/userCourse";

type Context = {
  user: Nullable<User>;
};

type DataSources = {
  userAPI: UserAPI;
  groupAPI: GroupAPI;
  courseAPI: CourseAPI;
  groupCourseAPI: GroupCourseAPI;
  userCourseAPI: UserCourseAPI;
};

export interface ApolloContext extends Context {
  dataSources: DataSources;
}

const dataSources = (): DataSources => ({
  userAPI: new UserAPI(models),
  groupAPI: new GroupAPI(models),
  courseAPI: new CourseAPI(models),
  groupCourseAPI: new GroupCourseAPI(models),
  userCourseAPI: new UserCourseAPI(models),
});

const context: ApolloServerExpressConfig["context"] = async ({
  req,
}): Promise<ApolloErrorable<Context>> => {
  const token: string = (req.headers && req.headers.authorization) || "";
  if (token.length === 0) return { user: null };
  try {
    const { id } = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await UserModel.findById(id);
    return { user };
  } catch (e) {
    return new AuthenticationError("Время сессии истекло!");
  }
};

const apolloServerConfig: ApolloServerExpressConfig = {
  typeDefs,
  resolvers,
  context,
  dataSources,
};

export default apolloServerConfig;
