import { UserInputError } from "apollo-server-express";
import { ApolloErrorable, Args } from "../../../../types";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import isAuth from "../../../../utils/middlewares/isAuth";
import bcrypt from "bcrypt";
import ApolloDatabaseError from "../../../../utils/apolloErrors/ApolloDatabaseError";

type UpdatePassArgs = {
  oldPassword: string;
  newPassword: string;
};

type UpdatePassResponse = {
  message: string;
};

const updatePass = async (
  _: any,
  { args }: Args<UpdatePassArgs>,
  { dataSources, user: conUser }: ApolloContext
): Promise<ApolloErrorable<UpdatePassResponse>> => {
  args.newPassword = args.newPassword.trim();
  args.oldPassword = args.oldPassword.trim();
  try {
    const { user } = isAuth(conUser);
    const isMatch = await bcrypt.compare(args.oldPassword, user.password);
    if (!isMatch) return new UserInputError("Неверный старый пароль!");
    if (args.newPassword === args.oldPassword)
      return new UserInputError("Старый и новый пароли не должны совпадать!");
    if (args.newPassword.length < 6)
      return new UserInputError(
        "Новый пароль должен быть не меньше 6 символов!"
      );

    const hashedPassword = await bcrypt.hash(args.newPassword, 12);
    const result = dataSources.userAPI.updatePassword(user.id, hashedPassword);
    if (!result) return new ApolloDatabaseError();
    return { message: "Пароль успешно обновлён!" };
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message);
  }
};

export default updatePass;
