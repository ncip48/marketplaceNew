import React, {Component} from 'react';
import {AppState, BackHandler, FlatList, ScrollView, View} from 'react-native';
import {Button, Card, Header, Text} from '../../components';
import colors from '../../utils/colors';
import {Socket} from 'socket.io-client';
import {baseURL} from '../../config';
import {
  currencyFormat,
  formatDate,
  getPriceDiskon,
  getStatusColor,
  getStatusOrder,
  Toaster,
} from '../../helpers';
import sizes from '../../utils/size';
import {connect} from 'react-redux';
import {_fetch} from '../../redux/actions/global';
import {CheckoutServices} from '../../services';
import {Image} from 'react-native-elements/dist/image/Image';
import {ActivityIndicator} from 'react-native-paper';
const io = require('socket.io-client');

export class PesananDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.route.params.item,
      isLoading: false,
      items: [],
    };
  }
  socket = io(baseURL, {transports: ['websocket']});

  async getData() {
    const {data} = this.state;
    const {_fetch, userInfo} = this.props;
    // console.log(userInfo);
    this.setState({isLoading: true});
    const res = await _fetch(
      CheckoutServices.getMyOrderDetail(this.state.data.id),
      false,
    );
    if (res) {
      this.setState({
        items: res.data.items,
        isLoading: false,
        data: {...data, status: res.data.status, waybill: res.data.waybill},
      });
    }
    // console.log(res);
  }

  async componentDidMount() {
    this.getData();

    let params = {
      trxId: this.state.data.orderId,
      userId: 2,
    };

    this.socket.emit('new payment', params);
    this.socket.on('payment:check', data => {
      console.log('SocketEventChat', data);
      if (data.status != 200) {
        return Toaster(data.error.message);
      }
      this.setState({data: data.data});
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
    const {data, items} = this.state;
    return (
      <>
        <Header title="Detail Pesanan" center />
        <ScrollView
          style={{flex: 1, backgroundColor: colors.bg, padding: sizes.fifTeen}}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text type="SemiBold" size={sizes.font14}>
                Order {data.orderId}
              </Text>
            </View>

            <Text color={colors.gray} size={sizes.font12}>
              {formatDate(
                data.transactionTime.split(' ')[0],
                'date-month-year',
              )}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: sizes.five,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text size={sizes.font12} color={colors.gray}>
                Resi:{' '}
              </Text>
              <Text size={sizes.font12}>{data.waybill ?? '-'}</Text>
            </View>
            <Text color={getStatusColor(data.status)} size={sizes.font12}>
              {getStatusOrder(data.status)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: sizes.five,
            }}>
            <Text size={sizes.font12} color={colors.black}>
              {items.length || 0} Items
            </Text>
          </View>
          <FlatList
            data={items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              return (
                <Card>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={{uri: JSON.parse(item.product.images)[0]}}
                      style={{
                        width: sizes.twentyFive * 3,
                        height: sizes.twentyFive * 3,
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                      }}
                      placeholderStyle={{backgroundColor: colors.white}}
                      PlaceholderContent={
                        <ActivityIndicator
                          color={colors.red}
                          size={sizes.fifTeen}
                        />
                      }
                      resizeMode="stretch"
                    />
                    <View style={{padding: sizes.fifTeen, flex: 1}}>
                      <Text size={sizes.font14} type="SemiBold">
                        {item.product.nameProduct}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text size={sizes.font12} color={colors.gray}>
                            Jumlah:{' '}
                          </Text>
                          <Text size={sizes.font12}>{item.quantity}</Text>
                        </View>
                        <View>
                          {item.discount > 0 && (
                            <Text
                              color={colors.black}
                              type="Bold"
                              align="right"
                              size={sizes.font12}>
                              {currencyFormat(
                                getPriceDiskon(
                                  item.discount,
                                  item.product.price,
                                ),
                              )}
                            </Text>
                          )}
                          <Text
                            align="right"
                            style={
                              item.discount > 0
                                ? {
                                    textDecorationLine: 'line-through',
                                    textDecorationStyle: 'solid',
                                    // marginBottom: sizes.five,
                                    // marginHorizontal: sizes.ten,
                                  }
                                : {}
                            }
                            color={
                              item.discount > 0 ? colors.gray : colors.black
                            }
                            size={
                              item.discount > 0 ? sizes.font10 : sizes.font12
                            }
                            type={item.discount > 0 ? 'Regular' : 'Bold'}>
                            {item.discount > 0
                              ? currencyFormat(parseInt(item.product.price))
                              : currencyFormat(parseInt(item.product.price))}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Card>
              );
            }}
          />
          <View style={{marginTop: sizes.twentyFive}}>
            <Text size={sizes.font12}>Rincian Pesanan</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: sizes.ten,
              }}>
              <Text size={sizes.font12} color={colors.gray}>
                Alamat :{' '}
              </Text>
              <Text size={sizes.font12}>{data.address.address}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: sizes.five,
              }}>
              <Text size={sizes.font12} color={colors.gray}>
                Metode Pembayaran :{' '}
              </Text>
              <Text size={sizes.font12}>{data.type}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: sizes.five,
              }}>
              <Text size={sizes.font12} color={colors.gray}>
                Kurir :{' '}
              </Text>
              <Text size={sizes.font12}>
                {data.courier}, {currencyFormat(data.ongkir)}
              </Text>
            </View>
            {data.discount > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: sizes.five,
                }}>
                <Text size={sizes.font12} color={colors.gray}>
                  Diskon Voucher :{' '}
                </Text>
                <Text size={sizes.font12}>{data.discount} %</Text>
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: sizes.five,
              }}>
              <Text size={sizes.font12} color={colors.gray}>
                Total Belanja :{' '}
              </Text>
              <Text size={sizes.font12}>
                {currencyFormat(getPriceDiskon(data.discount, data.subTotal))}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: sizes.twentyFive,
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Button
              rounded
              title={
                data.status == 'finish'
                  ? 'Lacak Resi'
                  : data.status == 'pending'
                  ? 'Bayar'
                  : data.status == 'settlement'
                  ? 'Hubungi Penjual'
                  : data.status == 'processing'
                  ? 'Lacak Resi'
                  : 'Hubungi Penjual'
              }
              bg="transparent"
              border
              color={colors.red}
              small
              style={{flex: 0.48}}
            />
            <Button
              rounded
              title={
                data.status == 'finish' && data.reviewed
                  ? 'Beli Lagi'
                  : data.status == 'finish' && !data.reviewed
                  ? 'Beri Ulasan'
                  : data.status == 'pending'
                  ? 'Batalkan Pesanan'
                  : data.status == 'settlement'
                  ? 'Batalkan Pesanan'
                  : data.status == 'processing'
                  ? 'Terima Pesanan'
                  : 'Beli Lagi'
              }
              bg={colors.red}
              border
              borderbg
              color={colors.white}
              small
              style={{flex: 0.48}}
            />
          </View>
        </ScrollView>
      </>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.auth.userInfo,
});

const mapDispatchToProps = {
  _fetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(PesananDetail);
