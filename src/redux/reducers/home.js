const initialState = () => ({
  banner: [],
  discount: [],
  newestProducts: [],
  categories: [],
  allProducts: [],
  terlaris: [],
});

const home = (state = initialState(), action = {}) => {
  switch (action.type) {
    case 'SET_HOME_STATE':
      return {...state, [action.name]: action.payload};

    default:
      return state;
  }
};

export default home;
