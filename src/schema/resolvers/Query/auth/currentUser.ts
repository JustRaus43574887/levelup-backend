import { ADMIN_LOGIN } from "../../../..";
import { Dictionary } from "../../../../models/Dictionary";
import { Group } from "../../../../models/Group";
import { User } from "../../../../models/User";
import { UserCourse } from "../../../../models/UserCourse";
import { ApolloErrorable, Nullable } from "../../../../types";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";

export enum Role {
  ADMIN = "ADMIN",
  STUDENT = "STUDENT",
}

export type CurrentUser = {
  role: Role;
  user: User;
  group?: Group;
  courses?: UserCourse[];
  dictionary?: Dictionary;
};

const currentUser = async (
  _: any,
  __: any,
  { user, dataSources }: ApolloContext
): Promise<ApolloErrorable<Nullable<CurrentUser>>> => {
  try {
    if (!user) return null;

    const role =
      ADMIN_LOGIN.trim().toLowerCase() === user.email.trim().toLowerCase()
        ? Role.ADMIN
        : Role.STUDENT;

    if (role === Role.ADMIN) return { role, user };
    else {
      const student = await dataSources.userAPI.findStudentById(user.id);
      if (!student) return new ApolloInternalServerError("Ошибка базы данных!");
      return {
        role,
        user: student,
        group: student.group as unknown as Group,
        courses: student.courses as unknown as UserCourse[],
        dictionary: student.dictionary as unknown as Dictionary,
      };
    }
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message);
  }
};

export default currentUser;
