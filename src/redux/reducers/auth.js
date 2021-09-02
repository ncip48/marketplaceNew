const initialState = () => ({
  userInfo: {},
  token: null,
  isLogin: false,
});

const auth = (state = initialState(), action = {}) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      const {token, ...userInfo} = action.payload;
      return {...state, userInfo, token, isLogin: true};

    case 'AUTH_RESET':
      const init = initialState();
      init.showOnboard = false;
      return {...state, ...init};

    default:
      return state;
  }
};

export default auth;
