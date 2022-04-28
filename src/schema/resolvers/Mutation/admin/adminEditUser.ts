import { UserInputError } from "apollo-server-express";
import { FileUpload } from "graphql-upload";
import IsEmail from "isemail";
import { Group } from "../../../../models/Group";
import { User } from "../../../../models/User";
import { ApolloErrorable, Args, Nullable } from "../../../../types";
import ApolloDatabaseError from "../../../../utils/apolloErrors/ApolloDatabaseError";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import isAuth from "../../../../utils/middlewares/isAuth";
import storeUpload, { FilePurpose } from "../../../../utils/storeUpload";
import { Role } from "../../Query/auth/currentUser";
import bcrypt from "bcrypt";

type AdminListUser = {
  user: User;
  group: Nullable<Group>;
};

type AdminUserArgs = {
  name: string;
  surname: string;
  email: string;
  password?: string;
  group?: string;
  avatar?: Promise<FileUpload>;
};

type AdminUserResponse = {
  message: string;
  user: AdminListUser;
};

interface Arguments extends Args<AdminUserArgs> {
  id: string;
}

const adminEditUser = async (
  _: any,
  { id, args }: Arguments,
  { dataSources, user: conUser }: ApolloContext
): Promise<ApolloErrorable<AdminUserResponse>> => {
  args.name = args.name.trim();
  args.surname = args.surname.trim();
  args.email = args.email.trim().toLowerCase();
  try {
    isAuth(conUser, Role.ADMIN);
    const isEmail = IsEmail.validate(args.email);
    if (!isEmail) return new UserInputError("Неверные e-mail!");
    if (args.password && args.password.length < 6)
      return new UserInputError("Пароль должен быть не меньше 6 символов!");
    const password = args.password
      ? await bcrypt.hash(args.password, 12)
      : undefined;
    const avatar = await storeUpload(args.avatar, FilePurpose.AVATAR);
    const result = await dataSources.userAPI.adminUpdateUser(id, {
      ...args,
      avatar,
      password,
    } as User);
    if (!result) return new ApolloDatabaseError();
    return {
      message: "Пользователь обновлён!",
      user: { user: result, group: result.group as unknown as Group },
    };
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message);
  }
};

export default adminEditUser;
