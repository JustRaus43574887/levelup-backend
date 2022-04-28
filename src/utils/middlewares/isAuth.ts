import { ForbiddenError } from "apollo-server-express";
import { ADMIN_LOGIN } from "../..";
import { User } from "../../models/User";
import { Role } from "../../schema/resolvers/Query/auth/currentUser";
import { Nullable } from "../../types";
import ApolloAuthError from "../apolloErrors/ApolloAuthError";

type IsAuthResult = {
  role: Role;
  user: User;
};

type IsAuth = (user: Nullable<User>, preferRole?: Role) => IsAuthResult;

const isAuth: IsAuth = (user, preferRole) => {
  if (!user) throw new ApolloAuthError();
  const isAdmin =
    ADMIN_LOGIN.trim().toLowerCase() === user.email.trim().toLowerCase();
  const role = isAdmin ? Role.ADMIN : Role.STUDENT;
  if (preferRole)
    if (role !== preferRole) throw new ForbiddenError("В доступе отказано!");
  return {
    role,
    user,
  };
};

export default isAuth;
