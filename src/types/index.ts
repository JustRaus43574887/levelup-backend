import { ApolloError } from "apollo-server-express";

export type Nullable<T> = T | null;
export type ApolloErrorable<T> = T | ApolloError;
export type Args<T> = {
  args: T;
};
