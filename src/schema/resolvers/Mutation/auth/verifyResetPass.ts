import { ApolloErrorable, Args } from "../../../../types";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../..";
import { UserInputError } from "apollo-server-express";
import ApolloDatabaseError from "../../../../utils/apolloErrors/ApolloDatabaseError";

type VerifyResetPassArgs = {
  token: string;
  code: string;
};

type VerifyResetPassResponse = {
  message: string;
  token: string;
};

const verifyResetPass = async (
  _: any,
  { args }: Args<VerifyResetPassArgs>,
  { dataSources }: ApolloContext
): Promise<ApolloErrorable<VerifyResetPassResponse>> => {
  try {
    const verify = jwt.verify(args.token, JWT_SECRET) as {
      code: string;
      id: string;
    };
    if (verify.code !== args.code)
      return new UserInputError("Вы ввели неверный код!");
    const user = await dataSources.userAPI.findUserById(verify.id);
    if (!user) return new ApolloDatabaseError();
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "5d",
    });
    return { message: "Вы можете сменить пароль в настройках!", token };
  } catch (e) {
    console.error(e);
    throw new ApolloInternalServerError(e.message);
  }
};

export default verifyResetPass;
