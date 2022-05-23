import {GraphQLClient} from "graphql-request";
export default function Client() {
  const endPoint =
    process.env.NODE_ENV === "production"
      ? "https://image2022.herokuapp.com/graphql"
      : "http://localhost:8080/graphql";
  let userToken;
  if (window.gapi)
    userToken = window.gapi.auth2.getAuthInstance().currentUser.get().tokenId;

  return new GraphQLClient(endPoint, {
    headers: {
      authorization: userToken,
    },
  });
}
