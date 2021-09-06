import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {baseURL} from '../config';

// taruh konfigurasi global axios disini
export const baseRequest = axios.create({baseURL});

// taruh header disini
export const generateHeaders = async types => {
  try {
    let headers = {};

    if (types.includes('content-json')) {
      headers['Content-Type'] = 'application/json';
    }
    // if (types.includes('authorization')) {
    //   headers['Authorization'] = 'Bearer ' + token;
    // }
    // if (types.includes('content-urlencoded')) {
    //   headers['Content-Type'] = 'application/x-www-form-urlencoded';
    // }
    if (types.includes('content-formdata')) {
      headers['Content-Type'] = 'multipart/form-data';
    }
    if (types.includes('authorization')) {
      const persist = await AsyncStorage.getItem('user:root');
      const root = JSON.parse(persist);
      const auth = JSON.parse(root.auth);
      headers['Authorization'] = 'Bearer ' + auth.token;
    }

    return {headers};
  } catch (e) {
    console.log(e);
    console.log(JSON.stringify(e));
  }
};
