import {Alert} from 'react-native';
import {ToastAndroid} from 'react-native';
import {Platform} from 'react-native';
import {firebase} from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import colors from '../utils/colors';
import {Snackbar} from 'react-native-paper';

PushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification: function (notification) {
    console.log('LOCAL NOTIFICATION ==>', notification);
  },
  popInitialNotification: true,
  requestPermissions: true,
});

export const debounce = function (fn, d) {
  let timer;
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(fn, d);
};

export const handleFetchError = (e, source) => {
  if (process.env && process.env.NODE_ENV == 'development') {
    console.log('error', source, e);
    console.log('error msg', source, e.details);

    if (e.request) console.log('request', e.request);
    if (e.response) console.log('response', e.response);
  }
  // alert('Error: ' + e.details + ` (url: ${source})`);
  Toaster(e.details);
};

export const currencyFormat = num => {
  return 'Rp ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
};

export const formatNumber = num => {
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
};

export const Toaster = (msg, duration = ToastAndroid.LONG) => {
  // let visible = true;
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, duration);
  } else {
    Alert.alert('Info', msg);
  }
};

export const getStatusOrder = status => {
  if (!status) return;
  switch (status) {
    case 'pending':
      return 'Belum Dibayar';
    case 'settlement':
      return 'Dibayar';
    case 'processing':
      return 'Diproses';
    case 'finish':
      return 'Selesai';
    case 'cancel':
      return 'Pembayaran Dibatalkan';
    case 'canceled':
      return 'Dibatalkan';
    case 'expire':
      return 'Pembayaran Expire';
    default:
      break;
  }
};

export const getStatusColor = status => {
  if (!status) return;
  switch (status) {
    case 'pending':
      return colors.red;
    case 'settlement':
      return colors.green;
    case 'processing':
      return 'Diproses';
    case 'finish':
      return colors.green;
    case 'cancel':
      return colors.red;
    case 'canceled':
      return colors.red;
    case 'expire':
      return colors.red;
    default:
      break;
  }
};

export const getFirebaseToken = async () => {
  const tokenFirebase = await firebase.messaging().getToken();
  return tokenFirebase;
};

export const getPriceDiskon = (percent, price) => {
  return parseInt(price - (percent / 100) * price);
};

export const actualQty = (qty, qtyBuy) => {
  return Number(qty - qtyBuy);
};

export const stringifyNumber = val => (Number(val) < 10 ? '0' + val : '' + val);

export const formatDate = (val = new Date(), format = 'year-month-date') => {
  const days = [
    'Ahad / Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    "Jum'at",
    'Sabtu',
  ];
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const monthsLess = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];

  if (typeof val == 'string') val = new Date(val);

  let res = format;
  if (format.includes('minute'))
    res = res.replace('minute', stringifyNumber(val.getMinutes()));
  if (format.includes('hour'))
    res = res.replace('hour', stringifyNumber(val.getHours()));
  if (format.includes('day')) res = res.replace('day', days[val.getDay()]);
  if (format.includes('date'))
    res = res.replace('date', stringifyNumber(val.getDate()));
  if (format.includes('monthName'))
    res = res.replace('monthName', months[val.getMonth()]);
  if (format.includes('monthLess'))
    res = res.replace('monthLess', monthsLess[val.getMonth()]);
  else if (format.includes('month'))
    res = res.replace('month', stringifyNumber(parseInt(val.getMonth()) + 1));
  if (format.includes('year')) res = res.replace('year', val.getFullYear());

  return res;
};

export const LocalNotification = async (title, msg) => {
  PushNotification.createChannel(
    {
      channelId: 'fcm_fallback_notification_channel', // (required)
      channelName: 'General Notification', // (required)
      channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    created => {
      // console.log({created});
    }, // (optional) callback returns whether the channel was created, false means it already existed.
  );

  PushNotification.localNotification({
    // id: '123',
    channelId: 'fcm_fallback_notification_channel',
    autoCancel: true,
    title: title,
    message: msg,
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: 'default',
    // ignoreInForeground: true,
  });

  // PushNotification.cancelAllLocalNotifications();

  PushNotification.getChannels(function (channel_ids) {
    // console.log(channel_ids); // ['channel_id_1']
  });

  let data = {
    title,
    msg,
    date: Date.now(),
  };

  let container = [];
};
