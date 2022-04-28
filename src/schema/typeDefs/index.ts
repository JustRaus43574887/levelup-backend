import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    currentUser: CurrentUser

    adminListUsers: [AdminListUser!]!
    adminFindUser(id: String!): AdminListUser!
    adminListGroups: [Group!]!
    adminFindGroup(id: String!): Group!
    adminListCourses: [Course!]!
    adminFindCourse(id: String!): Course!
    adminListExers: [GroupCourse!]!
    autoUsers: [Auto!]!
    autoCourses: [Auto!]!
    autoGroups: [Auto!]!
  }

  type Auto {
    id: String!
    name: String!
  }

  type CurrentUser {
    role: Role!
    user: User!
    group: Group
    courses: [UserCourse!]
    dictionary: Dictionary
  }

  type User {
    id: ID!
    email: String!
    name: String!
    surname: String!
    avatar: String!
    approved: Boolean!
    createdAt: Date!
  }

  type UserCourse {
    id: ID!
    completed: Boolean!
    course: Course!
    createdAt: Date!
  }

  type Group {
    id: ID!
    name: String!
    createdAt: Date!
    users: [User!]!
    courses: [GroupCourse!]!
  }

  type GroupCourse {
    group: Group!
    course: Course!
    createdAt: Date!
  }

  type Course {
    id: ID!
    name: String!
    createdAt: Date!
    tasks: [Task!]!
  }

  type Task {
    id: ID!
    type: TaskType!
    question: String!
    answer: String!
    task: String!
  }

  type Dictionary {
    id: ID!
    words: [DictionaryWord!]!
  }

  type DictionaryWord {
    id: ID!
    word: String!
    translation: String!
    createdAt: Date!
    expiredAt: Date!
    audioPath: String!
  }

  type AdminListUser {
    user: User!
    group: Group
  }

  type Mutation {
    login(args: LoginArgs!): LoginResponse!
    reg(args: RegArgs!): RegResponse!
    resetPass(email: String!): ResetPassResponse!
    verifyResetPass(args: VerifyResetPassArgs!): VerifyResetPassResponse!
    updatePass(args: UpdatePassArgs!): UpdatePassResponse!
    updateUser(args: UpdateUserArgs!): UpdateUserResponse!

    userCompleteCourse(id: String!): UserComplete!

    adminCreateUser(args: AdminUserArgs!): AdminUserResponse!
    adminDeleteUsers(ids: [String!]!): AdminDeleteResponse!
    adminEditUser(id: String!, args: AdminUserArgs!): AdminUserResponse!
    adminApproveUser(id: String!): AdminApproveUserResponse!

    adminCreateGroup(args: AdminGroupArgs!): AdminGroupResponse!
    adminDeleteGroups(ids: [String!]!): AdminDeleteResponse!
    adminEditGroup(id: String!, args: AdminGroupArgs!): AdminGroupResponse!

    adminCreateCourse(args: AdminCourseArgs!): AdminCourseResponse!
    adminDeleteCourses(ids: [String!]!): AdminDeleteResponse!
    adminEditCourse(id: String!, args: AdminCourseArgs!): AdminCourseResponse!
  }

  type UserComplete {
    message: String!
  }

  input LoginArgs {
    email: String!
    password: String!
  }

  type LoginResponse {
    message: String!
    token: String!
  }

  input RegArgs {
    name: String!
    surname: String!
    email: String!
    password: String!
  }

  type RegResponse {
    message: String!
  }

  type ResetPassResponse {
    message: String!
  }

  input VerifyResetPassArgs {
    token: String!
    code: String!
  }

  type VerifyResetPassResponse {
    message: String!
    token: String!
  }

  input UpdatePassArgs {
    oldPassword: String!
    newPassword: String!
  }

  type UpdatePassResponse {
    message: String!
  }

  input UpdateUserArgs {
    name: String!
    surname: String!
    email: String!
    avatar: Upload
  }

  type UpdateUserResponse {
    message: String!
    user: User!
  }

  type AdminApproveUserResponse {
    message: String!
    user: User!
  }

  type AdminDeleteResponse {
    message: String!
    ids: [String!]!
  }

  input AdminUserArgs {
    name: String!
    surname: String!
    email: String!
    password: String
    group: String
    avatar: Upload
  }

  type AdminUserResponse {
    message: String!
    user: AdminListUser!
  }

  input AdminGroupArgs {
    name: String!
    users: [String!]
    courses: [String!]
  }

  type AdminGroupResponse {
    message: String!
    group: Group!
  }

  input AdminCourseArgs {
    name: String!
    tasks: [TaskArgs!]!
  }

  type AdminCourseResponse {
    message: String!
    course: Course!
  }

  input TaskArgs {
    type: TaskType!
    question: String!
    answer: String!
    task: String
    upload: Upload
  }

  enum TaskType {
    TRANSLATION
    PERMUTATION
    IMAGE
    AUDIO
  }

  enum Role {
    ADMIN
    STUDENT
  }

  scalar Upload
  scalar Date
`;

export default typeDefs;
