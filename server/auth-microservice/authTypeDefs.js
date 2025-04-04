const { gql } = require('apollo-server-express');


//schema with roles
const typeDefs = gql`
enum Role {
RESIDENT
BUSINESS_OWNER
COMMUNITY_ORG
}

type User @key(fields: "id") {
id: ID!
username: String!
password: String!
email: String!
role: Role!
createdAt: String!
}

type AuthPayload {
token: String!
user: User!
}
type Query {
me: User
allUsers: [User]
}
type Mutation {
register(username: String!, password: String!, email: String!, role: Role!): AuthPayload

login(email: String!, password: String!): AuthPayload
}
`;
module.exports = typeDefs;