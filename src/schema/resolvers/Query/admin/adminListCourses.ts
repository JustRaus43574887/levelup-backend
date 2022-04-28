import { Course } from "../../../../models/Course";
import { ApolloErrorable } from "../../../../types";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import isAuth from "../../../../utils/middlewares/isAuth";
import { Role } from "../auth/currentUser";

const adminListCourses = async (
  _: any,
  __: any,
  { user, dataSources }: ApolloContext
): Promise<ApolloErrorable<Course[]>> => {
  try {
    isAuth(user, Role.ADMIN);
    return await dataSources.courseAPI.findAll();
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message, e.extensions.code);
  }
};

export default adminListCourses;
