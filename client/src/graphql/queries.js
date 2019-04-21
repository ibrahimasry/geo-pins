export const GET_PINS = `
 query GET_PINS {
     getPins {
         _id
         image 
         title
         content
         createdAt
         lat
         lng
         author {
             _id
             name
             picture
         }
         comments {
             text
             createdAt
             author {
                 name
                 picture
             }
         }

     }
 }


`;
