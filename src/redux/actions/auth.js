import {setFullscreenLoading} from './global';
import AsyncStorage from '@react-native-community/async-storage';

export const setUserInfo = (name, payload) => ({
  type: 'SET_USER_INFO',
  name,
  payload,
});
export const updateUserInfo = payload => ({
  type: 'UPDATE_USER_INFO',
  payload,
});
export const loginSuccess = payload => ({type: 'LOGIN_SUCCESS', payload});
export const logout = () => ({type: 'AUTH_RESET'});

export const login = data => {
  return async dispatch => {
    dispatch(setFullscreenLoading(true));
    const token = JSON.stringify({token: data.token});
    const root = JSON.stringify({auth: token});
    await AsyncStorage.setItem('user:root', root);
    dispatch(loginSuccess(data));
    dispatch(setFullscreenLoading(false));
  };
};
