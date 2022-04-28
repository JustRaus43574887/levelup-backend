import { ApolloErrorable } from "../../../../types";
import ApolloDatabaseError from "../../../../utils/apolloErrors/ApolloDatabaseError";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import isAuth from "../../../../utils/middlewares/isAuth";
import { Role } from "../../Query/auth/currentUser";

type AdminDeleteUserArgs = {
  ids: string[];
};

type AdminDeleteUserResponse = {
  message: string;
  ids: string[];
};

const adminDeleteUsers = async (
  _: any,
  { ids: argIds }: AdminDeleteUserArgs,
  { dataSources, user: conUser }: ApolloContext
): Promise<ApolloErrorable<AdminDeleteUserResponse>> => {
  try {
    isAuth(conUser, Role.ADMIN);
    const ids = await dataSources.userAPI.adminDeleteUsers(argIds);
    if (!ids) return new ApolloDatabaseError();
    return { message: "Успешно!", ids };
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message);
  }
};

export default adminDeleteUsers;
