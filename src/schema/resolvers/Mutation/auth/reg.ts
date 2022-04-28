import { UserInputError } from "apollo-server-express";
import { ApolloErrorable, Args } from "../../../../types";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import IsEmail from "isemail";
import bcrypt from "bcrypt";
import { User } from "../../../../models/User";
import ApolloDatabaseError from "../../../../utils/apolloErrors/ApolloDatabaseError";

type RegArgs = {
  name: string;
  surname: string;
  email: string;
  password: string;
};

type RegResponse = {
  message: string;
};

const reg = async (
  _: any,
  { args }: Args<RegArgs>,
  { dataSources }: ApolloContext
): Promise<ApolloErrorable<RegResponse>> => {
  args.email = args.email.trim().toLowerCase();
  args.password = args.password.trim().toLowerCase();
  try {
    const isEmail = IsEmail.validate(args.email);
    if (!isEmail) return new UserInputError("Неверные e-mail или пароль!");
    const candidate = await dataSources.userAPI.findUserByEmail(args.email);
    if (candidate)
      return new UserInputError("Пользователь с таким email уже существует!");
    if (args.password.length < 6)
      return new UserInputError("Пароль должен быть не меньше 6 символов!");

    const hashedPassword = await bcrypt.hash(args.password, 12);
    const data: User = { ...args, password: hashedPassword } as User;
    const user = await dataSources.userAPI.createUser(data);
    if (!user) return new ApolloDatabaseError();
    return { message: "Пользователь создан!" };
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message);
  }
};

export default reg;
