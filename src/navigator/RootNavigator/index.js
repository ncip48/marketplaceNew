import * as React from 'react';
import {StackActions} from '@react-navigation/native';
export const navigationRef = React.createRef();
export const isReadyRef = React.createRef();

export function navigate(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current?.navigate(name, params);
  } else {
    console.log('Navigator not rendered yet, we will loop this action again');
    // setTimeout(() => {
    //   navigate(name, params);
    // }, 10);
  }
}
export function push(...args) {
  navigationRef.current?.dispatch(StackActions.push(...args));
}
export function replace(...args) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current?.dispatch(StackActions.replace(...args));
  } else {
    console.log('Navigator not rendered yet, we will loop this action again');
    // setTimeout(() => {
    //   replace(...args);
    // }, 10);
  }
}
