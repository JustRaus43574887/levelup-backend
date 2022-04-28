import { Group } from "../../../../models/Group";
import { User } from "../../../../models/User";
import { ApolloErrorable, Nullable } from "../../../../types";
import ApolloDatabaseError from "../../../../utils/apolloErrors/ApolloDatabaseError";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import isAuth from "../../../../utils/middlewares/isAuth";
import { Role } from "../auth/currentUser";

type AdminListUser = {
  user: User;
  group: Nullable<Group>;
};

interface Arguments {
  id: string;
}

const adminFindUser = async (
  _: any,
  { id }: Arguments,
  { dataSources, user: conUser }: ApolloContext
): Promise<ApolloErrorable<AdminListUser>> => {
  try {
    isAuth(conUser, Role.ADMIN);
    const user = await dataSources.userAPI.adminFindUserById(id);
    if (!user) return new ApolloDatabaseError();
    return { user, group: user.group as unknown as Group };
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message);
  }
};

export default adminFindUser;
