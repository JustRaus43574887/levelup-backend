import { UserInputError } from "apollo-server-express";
import { FileUpload } from "graphql-upload";
import { Course } from "../../../../models/Course";
import { TaskType } from "../../../../models/Task";
import { ApolloErrorable, Args } from "../../../../types";
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

type AdminEditCourseArgs = Args<{
  name: string;
  tasks: TaskArgs[];
}> & { id: string };

type AdminEditCourseResponse = {
  message: string;
  course: Course;
};

type TaskItem = {
  type: TaskType;
  question: string;
  answer: string;
  task: string;
};

const adminEditCourse = async (
  _: any,
  { id, args }: AdminEditCourseArgs,
  { dataSources, user: conUser }: ApolloContext
): Promise<ApolloErrorable<AdminEditCourseResponse>> => {
  args.name = args.name.trim();
  try {
    isAuth(conUser, Role.ADMIN);
    if (!args.name.length)
      return new UserInputError("Имя не может быть пустым!");
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
    const course = await dataSources.courseAPI.adminUpdateCourse(
      id,
      args.name,
      tasks
    );
    return { message: "Курс обновлён!", course };
  } catch (e) {
    console.error(e);
    return new ApolloInternalServerError(e.message);
  }
};

export default adminEditCourse;
