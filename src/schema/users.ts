import { buildSchema } from 'graphql';

export const usersGQLSchema = buildSchema(`
    enum Role {
        Admin 
        User
    }

    type User {
        id: String!
        username: String!
        email: String!
        password: String!
        token: String
        role: Role
    }

    type Query {
        users: usersInfoResponse!
        user(id: String!): User!
        getMe: User!
    }

    type usersInfoResponse {
        success: Boolean!
        total: Int!
        users: [User!]!
    }

    type Mutation {
        regUser(username: String!, email: String!, password: String!, role: String!): User!
        loginUser(email: String!, password: String!): User!
        updateUser(id: String!, username: String, email: String, password: String): User!
        deleteUser(id: String!): deleteResponse!
    }

    type deleteResponse {
        success: Boolean!
        message: String!
        id: String!
    }
`);

