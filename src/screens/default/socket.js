import React, {Component} from 'react';
import {
  AppState,
  BackHandler,
  FlatList,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {Header} from '../../components';
import colors from '../../utils/colors';
import {Socket} from 'socket.io-client';
import {baseURL} from '../../config';
const io = require('socket.io-client');

export default class socketdef extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.route.params.item,
    };
  }
  socket = io(baseURL, {transports: ['websocket']});

  async componentDidMount() {
    let params = {
      trxId: this.state.data.orderId,
      userId: 2,
    };

    this.socket.emit('new payment', params);
    this.socket.on('payment:check', data => {
      console.log('SocketEventChat', data);
    });

    this.socket.on('connection', () => {
      this.socket.emit('new payment', params);
    });

    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    let socket = this.socket;
    socket.off('payment:check');
    socket.off('connection');
    this.backhandler.remove();
    AppState.removeEventListener('change', this._handleAppStateChange);
    console.log('running unmount');
  }

  _handleAppStateChange = nextAppState => {
    if (
      AppState.currentState == 'background' ||
      AppState.currentState == 'inactive'
    ) {
      this.socket.disconnect();
    } else {
      this.connectMeAgain();
    }
    this.setState({appState: nextAppState});
  };

  connectMeAgain = async () => {
    this.socket.connect();
    let params = {
      trxId: this.state.data.orderId,
      userId: 2,
    };
    //   console.log(params)
    this.socket.emit('new payment', params);
  };

  backhandler = BackHandler.addEventListener('hardwareBackPress', () => {
    this.socket.disconnect();
    // AppState.removeEventListener('change', this._handleAppStateChange);
    // console.log('abcd');
    return false;
  });

  render() {
    const {data} = this.state;
    return (
      <>
        <Header title="Detail Pesanan" center />
        <ScrollView
          style={{flex: 1, backgroundColor: colors.bg}}
          showsVerticalScrollIndicator={false}>
          <FlatList />
        </ScrollView>
      </>
    );
  }
}
