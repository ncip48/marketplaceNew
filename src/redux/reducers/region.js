const initialState = () => ({
  province: [],
  city: [],
  disctrict: [],
});

const region = (state = initialState(), action = {}) => {
  switch (action.type) {
    case 'SET_REGION_STATE':
      return {...state, [action.name]: action.payload};

    default:
      return state;
  }
};

export default region;
