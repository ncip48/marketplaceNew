const initialState = () => ({
  isLoading: false,
  fullscreenLoading: false,
});

const global = (state = initialState(), action = {}) => {
  switch (action.type) {
    case 'GLOBAL_LOADING':
      return {...state, isLoading: action.payload};

    case 'FULLSCREEN_LOADING':
      return {...state, fullscreenLoading: action.payload};

    case 'GLOBAL_RESET':
      return {...state, ...initialState()};

    default:
      return state;
  }
};

export default global;
