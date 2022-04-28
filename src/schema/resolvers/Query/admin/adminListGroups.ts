import { Group } from "../../../../models/Group";
import { ApolloErrorable } from "../../../../types";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import isAuth from "../../../../utils/middlewares/isAuth";
import { Role } from "../auth/currentUser";

const adminListGroups = async (
  _: any,
  __: any,
  { dataSources, user }: ApolloContext
): Promise<ApolloErrorable<Group[]>> => {
  try {
    isAuth(user, Role.ADMIN);
    const result = await dataSources.groupAPI.findAll();
    return result;
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message, e.extensions.code);
  }
};

export default adminListGroups;
