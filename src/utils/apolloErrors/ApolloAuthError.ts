import { AuthenticationError } from "apollo-server-express";

class ApolloAuthError extends AuthenticationError {
  constructor() {
    super("Не авторизован!");
  }
}

export default ApolloAuthError;
