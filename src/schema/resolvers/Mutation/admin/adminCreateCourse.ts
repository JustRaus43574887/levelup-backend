import { UserInputError } from "apollo-server-express";
import { FileUpload } from "graphql-upload";
import { Course } from "../../../../models/Course";
import { TaskType } from "../../../../models/Task";
import { ApolloErrorable, Args } from "../../../../types";
import ApolloDatabaseError from "../../../../utils/apolloErrors/ApolloDatabaseError";
import ApolloInternalServerError from "../../../../utils/apolloErrors/ApolloInternalServerError";
import { ApolloContext } from "../../../../utils/apolloServerConfig";
import isAuth from "../../../../utils/middlewares/isAuth";
import storeUpload, { FilePurpose } from "../../../../utils/storeUpload";
import { Role } from "../../Query/auth/currentUser";

type TaskArgs = {
  type: TaskType;
  question: string;
  answer: string;
  task?: string;
  upload?: Promise<FileUpload>;
};

type AdminCreateCourseArgs = {
  name: string;
  tasks: TaskArgs[];
};

type AdminCreateCourseResponse = {
  message: string;
  course: Course;
};

type TaskItem = {
  type: TaskType;
  question: string;
  answer: string;
  task: string;
};

const adminCreateCourse = async (
  _: any,
  { args }: Args<AdminCreateCourseArgs>,
  { dataSources, user: conUser }: ApolloContext
): Promise<ApolloErrorable<AdminCreateCourseResponse>> => {
  args.name = args.name.trim();
  try {
    isAuth(conUser, Role.ADMIN);
    if (!args.name.length)
      return new UserInputError("Имя не может быть пустым!");
    const condidate = await dataSources.courseAPI.adminFindByName(args.name);
    if (condidate)
      return new UserInputError("Курс с таким названием уже существует!");
    const tasks: TaskItem[] = [];
    for (let i in args.tasks) {
      if (!args.tasks[i].question.length)
        return new UserInputError("Поле 'Вопрос' не может быть пустым!");
      if (!args.tasks[i].answer.length)
        return new UserInputError("Поле 'Ответ' не может быть пустым!");
      if (args.tasks[i].type === TaskType.IMAGE)
        args.tasks[i].task = await storeUpload(
          args.tasks[i].upload,
          FilePurpose.TEST_IMAGE
        );
      tasks.push({ ...(args.tasks[i] as TaskItem) });
    }
    const course = await dataSources.courseAPI.adminCreateCourse(
      args.name,
      tasks
    );
    if (!course) return new ApolloDatabaseError();
    return { message: "Курс создан!", course };
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message);
  }
};

export default adminCreateCourse;
