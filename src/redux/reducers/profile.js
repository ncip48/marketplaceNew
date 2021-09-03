const initialState = () => ({
  orders: [],
  address: [],
  reviews: [],
  cart: [],
});

const profile = (state = initialState(), action = {}) => {
  switch (action.type) {
    case 'SET_PROFILE_STATE':
      return {...state, [action.name]: action.payload};

    case 'DELETE_ADDRESS':
      return {
        ...state,
        address: state.address.filter(
          (item, index) => item.id !== action.payload,
        ),
      };

    case 'UPDATE_ADDRESS':
      return Object.assign({}, state, {
        address: state.address.map(item => {
          return item.id === action.payload.id ? action.payload : item;
        }), // replace matched item and returns the array
      });

    case 'DELETE_CART':
      return {
        ...state,
        cart: state.cart.filter((item, index) => item.id !== action.payload),
      };

    default:
      return state;
  }
};

export default profile;
