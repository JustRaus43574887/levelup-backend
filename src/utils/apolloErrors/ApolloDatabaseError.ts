import { ApolloError } from "apollo-server-errors";
import { ErrorCodes } from "./codes";

class ApolloDatabaseError extends ApolloError {
  constructor() {
    super("Ошибка базы данных!", ErrorCodes.DATABASE_ERROR);
  }
}

export default ApolloDatabaseError;
