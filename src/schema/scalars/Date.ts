import { GraphQLScalarType, Kind } from "graphql";

const GraphQLDate = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize: (date) => new Date(date as Date).toISOString(),
  parseValue(value) {
    return new Date(value as number);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  },
});

export default GraphQLDate;
