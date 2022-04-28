import { ApolloErrorable } from "../../../../types";
import ApolloDatabaseError from "../../../../utils/apolloErrors/ApolloDatabaseError";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import isAuth from "../../../../utils/middlewares/isAuth";
import { Role } from "../../Query/auth/currentUser";

type AdminDeleteCoursesArgs = {
  ids: string[];
};

type AdminDeleteCoursesResponse = {
  message: string;
  ids: string[];
};

const adminDeleteCourses = async (
  _: any,
  { ids: argIds }: AdminDeleteCoursesArgs,
  { dataSources, user: conUser }: ApolloContext
): Promise<ApolloErrorable<AdminDeleteCoursesResponse>> => {
  try {
    isAuth(conUser, Role.ADMIN);
    const ids = await dataSources.courseAPI.adminDeleteCourses(argIds);
    if (!ids) return new ApolloDatabaseError();
    return { message: "Успешно!", ids };
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message);
  }
};

export default adminDeleteCourses;
