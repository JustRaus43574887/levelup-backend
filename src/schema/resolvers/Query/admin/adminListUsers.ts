import { Group } from "../../../../models/Group";
import { User } from "../../../../models/User";
import { ApolloErrorable, Nullable } from "../../../../types";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import isAuth from "../../../../utils/middlewares/isAuth";
import { Role } from "../auth/currentUser";

type AdminListUser = {
  user: User;
  group: Nullable<Group>;
};

const adminListUsers = async (
  _: any,
  __: any,
  { user, dataSources }: ApolloContext
): Promise<ApolloErrorable<AdminListUser[]>> => {
  try {
    isAuth(user, Role.ADMIN);
    const users = await dataSources.userAPI.adminFindAll();
    return users.map<AdminListUser>((user) => ({
      user,
      group: user.group as unknown as Group,
    }));
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message, e.extensions.code);
  }
};

export default adminListUsers;
