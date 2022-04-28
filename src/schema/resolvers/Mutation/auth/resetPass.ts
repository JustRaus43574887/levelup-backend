import { UserInputError } from "apollo-server-express";
import { ApolloErrorable } from "../../../../types";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import IsEmail from "isemail";
import randomize from "randomatic";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../..";
import { sendEmail } from "../../../../utils/email";
import { resetHtml } from "../../../../utils/email/Reset";

type ResetPassArgs = {
  email: string;
};

type ResetPassResponse = {
  message: string;
};

const resetPass = async (
  _: any,
  { email }: ResetPassArgs,
  { dataSources }: ApolloContext
): Promise<ApolloErrorable<ResetPassResponse>> => {
  email = email.trim().toLowerCase();
  try {
    const isEmail = IsEmail.validate(email);
    if (!isEmail) return new UserInputError("Неверный email!");
    const user = await dataSources.userAPI.findUserByEmail(email);
    if (!user) return new UserInputError("Такого пользователя не существует!");
    const randomCode = randomize("0", 6);
    const token = jwt.sign({ code: randomCode, id: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const isSend = await sendEmail(
      email,
      "Код для авторизации",
      resetHtml(randomCode, token)
    );
    if (!isSend)
      return new ApolloInternalServerError("Ошибка отправки письма!");
    return { message: "Письмо успешно отправлено!" };
  } catch (e) {
    console.error(e);
    throw new ApolloInternalServerError(e.message);
  }
};

export default resetPass;
