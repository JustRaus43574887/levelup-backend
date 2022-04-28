import { Course } from "../../../../models/Course";
import { ApolloErrorable } from "../../../../types";
import ApolloDatabaseError from "../../../../utils/apolloErrors/ApolloDatabaseError";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import isAuth from "../../../../utils/middlewares/isAuth";
import { Role } from "../auth/currentUser";

interface Arguments {
  id: string;
}

const adminFindCourse = async (
  _: any,
  { id }: Arguments,
  { dataSources, user: conUser }: ApolloContext
): Promise<ApolloErrorable<Course>> => {
  try {
    isAuth(conUser, Role.ADMIN);
    const course = await dataSources.courseAPI.adminFindById(id);
    if (!course) return new ApolloDatabaseError();
    return course;
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message);
  }
};

export default adminFindCourse;
