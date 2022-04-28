import { UserInputError } from "apollo-server-express";
import { Group } from "../../../../models/Group";
import { ApolloErrorable, Args } from "../../../../types";
import ApolloDatabaseError from "../../../../utils/apolloErrors/ApolloDatabaseError";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import isAuth from "../../../../utils/middlewares/isAuth";
import { Role } from "../../Query/auth/currentUser";

type AdminGroupArgs = {
  name: string;
  users?: string[];
  courses?: string[];
};

type AdminGroupResponse = {
  message: string;
  group: Group;
};

type Arguments = Args<AdminGroupArgs> & {
  id: string;
};

const adminEditGroup = async (
  _: any,
  { id, args }: Arguments,
  { dataSources, user: conUser }: ApolloContext
): Promise<ApolloErrorable<AdminGroupResponse>> => {
  args.name = args.name.trim();
  try {
    isAuth(conUser, Role.ADMIN);
    if (!args.name.length) return new UserInputError("Имя обязательно!");
    const group = await dataSources.groupAPI.adminUpdateGroup(id, args);
    if (!group) return new ApolloDatabaseError();
    return { message: "Группа обновлена!", group };
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message);
  }
};

export default adminEditGroup;
