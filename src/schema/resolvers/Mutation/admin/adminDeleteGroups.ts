import { ApolloErrorable } from "../../../../types";
import ApolloDatabaseError from "../../../../utils/apolloErrors/ApolloDatabaseError";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import isAuth from "../../../../utils/middlewares/isAuth";
import { Role } from "../../Query/auth/currentUser";

type AdminDeleteGroupsArgs = {
  ids: string[];
};

type AdminDeleteGroupsResponse = {
  message: string;
  ids: string[];
};

const adminDeleteGroups = async (
  _: any,
  { ids: argIds }: AdminDeleteGroupsArgs,
  { dataSources, user: conUser }: ApolloContext
): Promise<ApolloErrorable<AdminDeleteGroupsResponse>> => {
  try {
    isAuth(conUser, Role.ADMIN);
    const ids = await dataSources.groupAPI.adminDeleteGroups(argIds);
    if (!ids) return new ApolloDatabaseError();
    return { message: "Успешно!", ids };
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message);
  }
};

export default adminDeleteGroups;
