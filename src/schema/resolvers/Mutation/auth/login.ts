import { ApolloErrorable, Args } from "../../../../types";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import { UserInputError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../..";
import IsEmail from "isemail";

type LoginArgs = {
  email: string;
  password: string;
};

type LoginResponse = {
  message: string;
  token: string;
};

const login = async (
  _: any,
  { args }: Args<LoginArgs>,
  { dataSources }: ApolloContext
): Promise<ApolloErrorable<LoginResponse>> => {
  args.email = args.email.trim().toLowerCase();
  args.password = args.password.trim();
  try {
    const isEmail = IsEmail.validate(args.email);
    if (!isEmail) return new UserInputError("Неверные e-mail или пароль!");
    const user = await dataSources.userAPI.findUserByEmail(args.email);
    if (!user) return new UserInputError("Такого пользователя не существует!");
    const isMatch = await bcrypt.compare(args.password, user.password);
    if (!isMatch) return new UserInputError("Неверные e-mail или пароль!");
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "5d" });
    return { message: "С возвращением!", token };
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message);
  }
};

export default login;
