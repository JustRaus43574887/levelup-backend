import { ApolloError } from "apollo-server-errors";
import { ErrorCodes } from "./codes";

class ApolloUploadError extends ApolloError {
  constructor() {
    super("Ошибка выгрузки фаила!", ErrorCodes.UPLOAD_ERROR);
  }
}

export default ApolloUploadError;
