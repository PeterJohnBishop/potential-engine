import { buildSchema } from 'graphql';

export const schema = buildSchema(`
type Query { hello: String }

type User {
  id: ID!
  name: String!
  email: String!
  bio: String
}

input CreateUserInput {
  name: String!
  email: String!
  bio: String
}

input UpdateUserInput {
  name: String
  email: String
  bio: String
}

type Query {
  getUser(id: ID!): User
  getUsers: [User!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}
`)


