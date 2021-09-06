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

    case 'UPDATE_USER_INFO':
      return {...state, userInfo: action.payload};

    case 'SET_USER_INFO':
      const otherUserInfo = Object.keys(state.userInfo)
        .filter(key => key !== action.name)
        .reduce((obj, key) => ({...obj, [key]: state.userInfo[key]}), {});
      return {
        ...state,
        userInfo: {...otherUserInfo, [action.name]: action.payload},
      };

    case 'AUTH_RESET':
      const init = initialState();
      init.showOnboard = false;
      return {...state, ...init};

    default:
      return state;
  }
};

export default auth;
