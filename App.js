import 'react-native-gesture-handler';
import React, {Component} from 'react';
import MainNavigation from './src/navigator/index';
import messaging from '@react-native-firebase/messaging';
import {Alert, LogBox} from 'react-native';
// import {Provider as ProviderFW} from 'react-native-paper'
import ResponsiveScreen from 'react-native-auto-responsive-screen';
import {Provider} from 'react-redux';

import configureStore from './src/redux/store';

import {PersistGate} from 'redux-persist/integration/react';
import PushNotification from 'react-native-push-notification';

const {store, persistor} = configureStore();

ResponsiveScreen.init(375, 812);

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('message handled in the background');
  console.log('Background remote msg', remoteMessage);
  // const state = store.getState();
  // const driver = state.driverReducer;
  // const driverOrder = state.driverOrder;
  // const notif = state.notif;

  let data = remoteMessage['data'] ?? [];
  data = {...data, msg: remoteMessage.notification.title};
  console.log('backgroundFormatedData', data);
  // PushNotification.cancelLocalNotification('123');

  // if (servLower(data.service) == 'jbmarket') {
  //   let msgBody =
  //     remoteMessage?.data?.msgMarkup || remoteMessage?.notification?.body;
  //   let msgTitle = remoteMessage?.notification?.title;
  //   let msgDate = Date.now();
  //   let msgImg = remoteMessage?.data?.image || fallbackImg;
  //   let msgMarkup = remoteMessage?.data?.msgMarkup || msgTitle;

  //   store.dispatch(
  //     setNotification({
  //       title: msgTitle,
  //       msg: msgBody,
  //       date: msgDate,
  //       image: msgImg,
  //       msgMarkup: msgMarkup,
  //       service: 'marketplace',
  //     }),
  //   );
  // }
});

export default class App extends Component {
  componentDidMount() {
    // LogBox.ignoreLogs([
    //   'VirtualizedLists should never be nested',
    //   'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
    //   '%s: Calling `getNode()`',
    // ]);
    LogBox.ignoreAllLogs();
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MainNavigation />
        </PersistGate>
      </Provider>
    );
  }
}
