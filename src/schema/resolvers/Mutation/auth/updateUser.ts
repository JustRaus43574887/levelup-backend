import { UserInputError } from "apollo-server-express";
import { ApolloErrorable, Args } from "../../../../types";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import isAuth from "../../../../utils/middlewares/isAuth";
import ApolloDatabaseError from "../../../../utils/apolloErrors/ApolloDatabaseError";
import { FileUpload } from "graphql-upload";
import { User } from "../../../../models/User";
import IsEmail from "isemail";
import storeUpload, { FilePurpose } from "../../../../utils/storeUpload";

type UpdateUserArgs = {
  name: string;
  surname: string;
  email: string;
  avatar?: Promise<FileUpload>;
};

type UpdateUserResponse = {
  message: string;
  user: User;
};

const updatePass = async (
  _: any,
  { args }: Args<UpdateUserArgs>,
  { dataSources, user: conUser }: ApolloContext
): Promise<ApolloErrorable<UpdateUserResponse>> => {
  args.name = args.name.trim();
  args.surname = args.surname.trim();
  args.email = args.email.trim().toLowerCase();
  try {
    const { user } = isAuth(conUser);
    const isEmail = IsEmail.validate(args.email);
    if (!isEmail) return new UserInputError("Неверные e-mail!");
    const avatar = await storeUpload(args.avatar, FilePurpose.AVATAR);
    const result = await dataSources.userAPI.updateUser(user.id, {
      ...args,
      avatar,
    } as User);
    if (!result) return new ApolloDatabaseError();
    return { message: "Пользователь обновлён!", user: result };
  } catch (e) {
    console.error(e);
    throw new ApolloInternalServerError(e.message);
  }
};

export default updatePass;
