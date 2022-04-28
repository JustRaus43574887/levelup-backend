import { GraphQLUpload } from "graphql-upload";
import GraphQLDate from "../scalars/Date";
import Mutation from "./Mutation";
import Query from "./Query";

const resolvers = {
  Upload: GraphQLUpload,
  Date: GraphQLDate,
  Query,
  Mutation,
};

export default resolvers;
