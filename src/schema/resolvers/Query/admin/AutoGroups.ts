import { ApolloErrorable } from "../../../../types";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import isAuth from "../../../../utils/middlewares/isAuth";
import { Role } from "../auth/currentUser";

type Auto = {
  id: string;
  name: string;
};

const autoGroups = async (
  _: any,
  __: any,
  { user, dataSources }: ApolloContext
): Promise<ApolloErrorable<Auto[]>> => {
  try {
    isAuth(user, Role.ADMIN);
    const result = await dataSources.groupAPI.adminAutoFindAll();
    return result as Auto[];
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message, e.extensions.code);
  }
};

export default autoGroups;
