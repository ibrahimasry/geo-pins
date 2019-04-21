import { GraphQLClient } from "graphql-request";
export default function Client() {
  const endPoint =
    process.env.NODE_ENV === "production"
      ? ""
      : "http://localhost:8080/graphql";
  const userToken = window.gapi.auth2.getAuthInstance().currentUser.get()
    .tokenId;

  return new GraphQLClient(endPoint, {
    headers: {
      authorization: userToken
    }
  });
}
