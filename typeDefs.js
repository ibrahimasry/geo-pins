const { gql } = require("apollo-server");
module.exports = gql`
  type User {
    _id: ID
    name: String
    email: String
    picture: String
  }

  input CreatePinInput {
    _id: ID
    title: String!
    content: String!
    image: String!
    lat: Float!
    lng: Float!
  }

  type Pin {
    _id: ID
    title: String!
    content: String!
    author: User!
    image: String!
    comments: [Comment]
    createdAt: String
    lat: String!
    lng: String!
  }

  type Comment {
    createdAt: String
    author: User
    text: String
    pin:ID
  }
  type Query {
    "A simple type for getting started!"
    me: User
    getPins: [Pin!]
  }

  type Mutation {
    createPin(input: CreatePinInput!): Pin
    deletePin(_id: ID!): Pin!
    createComment(pinId: ID!, text: String): Comment!
  }

  type Subscription {
    pinAdded: Pin
    pinDeleted: Pin
    pinUpdated: Comment
  }
`;
