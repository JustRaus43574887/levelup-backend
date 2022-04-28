import { GroupCourse } from "../../../../models/GroupCourse";
import { ApolloErrorable } from "../../../../types";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import isAuth from "../../../../utils/middlewares/isAuth";
import { Role } from "../auth/currentUser";

const adminListExers = async (
  _: any,
  __: any,
  { user, dataSources }: ApolloContext
): Promise<ApolloErrorable<GroupCourse[]>> => {
  try {
    isAuth(user, Role.ADMIN);
    return await dataSources.groupCourseAPI.adminFindAll();
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message, e.extensions.code);
  }
};

export default adminListExers;
