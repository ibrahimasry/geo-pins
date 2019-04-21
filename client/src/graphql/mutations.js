export const CREATE_PIN = `
  mutation CREATE_PIN ($title:String!, $content:String!, $image:String!, $lat:Float! $lng:Float!){
    createPin(input:{title:$title content:$content image:$image lat:$lat lng:$lng}){
          _id
          title
          content 
          image
          lat
          lng
          author {
              _id
              name
              picture
          }
      }
  }

`;

export const DELETE_PIN = `
  mutation DELETE_PIN ($_id :ID!){
    deletePin(_id :$_id){
          _id
    }
  }
`;

export const CREATE_COMMENT = `
mutation CREATE_COMMENT ($pinId :ID!, $text:String){
  createComment(pinId :$pinId text:$text){
    text
    author {
      name
      picture
    }
  }
}
`;
