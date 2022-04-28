import { Group } from "../../../../models/Group";
import { ApolloErrorable } from "../../../../types";
import ApolloDatabaseError from "../../../../utils/apolloErrors/ApolloDatabaseError";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import isAuth from "../../../../utils/middlewares/isAuth";
import { Role } from "../auth/currentUser";

interface Arguments {
  id: string;
}

const adminFindGroup = async (
  _: any,
  { id }: Arguments,
  { dataSources, user: conUser }: ApolloContext
): Promise<ApolloErrorable<Group>> => {
  try {
    isAuth(conUser, Role.ADMIN);
    const group = await dataSources.groupAPI.adminFindById(id);
    if (!group) return new ApolloDatabaseError();
    return group;
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message);
  }
};

export default adminFindGroup;
