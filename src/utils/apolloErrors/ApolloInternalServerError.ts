import { ApolloError } from "apollo-server-errors";
import { ErrorCodes } from "./codes";

class ApolloInternalServerError extends ApolloError {
  constructor(message: string, code?: string) {
    super(message, code || ErrorCodes.INTERNAL_SERVER_ERROR);
  }
}

export default ApolloInternalServerError;
