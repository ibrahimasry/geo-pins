export default function reducer(state, action) {
  switch (action.type) {
    case "LOGGED_IN":
      return { ...state, currentUser: action.payload };
    case "IS_LOGGED_IN":
      return { ...state, isAuth: action.payload };
    case "SIGN_OUT":
      return { ...state, currentUser: null, isAuth: false };
    case "CREATE_DRAFT":
      return { ...state, draft: action.payload };
    case "DELETE_DRAFT":
      return { ...state, draft: null };
    case "ADD_PIN":
      const newState = {
        ...state,
        pins: [
          action.payload,
          ...state.pins.filter(pin => pin._id !== action.payload)
        ]
      };

      return newState;

    case "GET_PINS":
      return {
        ...state,
        pins: action.payload
      };

    case "SHOW_POPUP":
      return { ...state, pin: action.payload };
    case "HIDE_POPUP":
      return { ...state, pin: null };

    case "DELETE_PIN":
      return {
        ...state,
        pins: [
          ...state.pins.filter(pin => {
            return pin._id !== action.payload;
          })
        ],
        pin: null
      };

      case "CREATE_COMMENT":

      return {
        ...state,
        pins: [
          ...state.pins.map(pin => {
           if (pin._id === action.payload.pin) {
             pin.comments.unshift(action.payload)
           }

           return pin
          })
          ],
      
      };
  

    default:
      break;
  }
}
