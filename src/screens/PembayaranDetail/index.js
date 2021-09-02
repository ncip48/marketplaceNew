import React, {useState, useEffect} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {View} from 'react-native';
import {Icon} from 'react-native-elements';
import {Header, Text} from '../../components';
import colors from '../../utils/colors';
const io = require('socket.io-client');

var socket = io('http://192.168.0.107:8000', {transports: ['websocket']});

const PembayaranDetail = ({navigation, route}) => {
  const {result} = route.params;
  const [hasil, setHasil] = useState(result);
  // console.log(result);

  useEffect(() => {
    const order_id = result.order_id;
    try {
      socket.on('connect', function (data) {
        socket.emit('new payment', {trxId: order_id, userId: 2});
      });
      socket.on('payment:check', function (data) {
        console.log('asdfff', JSON.stringify(data));
        setHasil({...hasil, status: data.data.status});
      });
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  // socket.on('connect', function (data) {
  //   socket.emit('new payment', {trxId: order_id, userId: 2});
  // });
  // socket.on('payment:check', function (data) {
  //   console.log('asdfff', JSON.stringify(data));
  //   setHasil({...hasil, status: data.data.status});
  // });

  return (
    <>
      <Header title="Status Pembayaran" />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>{hasil.order_id}</Text>
        <Text>{hasil.status}</Text>
        <Icon
          name={
            hasil.status == 'pending'
              ? 'timer-sand'
              : hasil.status == 'settlement'
              ? 'check'
              : 'close'
          }
          type="material-community"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default PembayaranDetail;
