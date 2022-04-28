import { User } from "../../../../models/User";
import { ApolloErrorable } from "../../../../types";
import ApolloDatabaseError from "../../../../utils/apolloErrors/ApolloDatabaseError";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import isAuth from "../../../../utils/middlewares/isAuth";
import { Role } from "../../Query/auth/currentUser";

type AdminApproveUserArgs = {
  id: string;
};

type AdminApproveUserResponse = {
  message: string;
  user: User;
};

const adminApproveUser = async (
  _: any,
  { id }: AdminApproveUserArgs,
  { dataSources, user: conUser }: ApolloContext
): Promise<ApolloErrorable<AdminApproveUserResponse>> => {
  try {
    isAuth(conUser, Role.ADMIN);
    const user = await dataSources.userAPI.adminApproveUser(id);
    if (!user) return new ApolloDatabaseError();
    return { message: "Пользователь подтверждён!", user };
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message);
  }
};

export default adminApproveUser;
