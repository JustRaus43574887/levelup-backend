import { ApolloErrorable } from "../../../../types";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import isAuth from "../../../../utils/middlewares/isAuth";
import { Role } from "../../Query/auth/currentUser";

type UserCompleteCourseArgs = {
  id: string;
};

type UserCompleteCourseResponse = {
  message: string;
};

const userCompleteCourse = async (
  _: any,
  { id }: UserCompleteCourseArgs,
  { dataSources, user: conUser }: ApolloContext
): Promise<ApolloErrorable<UserCompleteCourseResponse>> => {
  try {
    const { user } = isAuth(conUser, Role.STUDENT);
    await dataSources.userCourseAPI.userCompleteCourse(id, user.id);
    return { message: "Курс пройден!" };
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message);
  }
};

export default userCompleteCourse;
