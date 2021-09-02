import React, {useEffect} from 'react';
import {StyleSheet, FlatList, Animated, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {Button, Header, Text} from '../../components';
import colors from '../../utils/colors';
import {useSelector, useDispatch} from 'react-redux';
import sizes from '../../utils/size';
import {CheckoutServices} from '../../services';
import {RefreshControl} from 'react-native';
import {setProfileState} from '../../redux/actions/profile';
import {_fetch} from '../../redux/actions/global';
import {
  currencyFormat,
  formatDate,
  getPriceDiskon,
  getStatusColor,
  getStatusOrder,
} from '../../helpers';
import {Icon} from 'react-native-elements';
import {font} from '../../utils';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {RFPercentage} from 'react-native-responsive-fontsize';

// const tabs = [
//   {title: 'Belum Bayar', component: 'Pending', status: 'pending'},
//   {title: 'Dibayar', component: 'Settlement', status: 'settlement'},
//   {title: 'Diproses', component: 'Processing', status: 'processing'},
//   {title: 'Selesai', component: 'Finish', status: 'finish'},
//   {title: 'Dibatalkan', component: 'Cancel', status: 'cancel'},
// ];

const tabs = [
  {title: 'Diproses', component: 'Processing', status: 'processing'},
  {title: 'Selesai', component: 'Finish', status: 'finish'},
  {title: 'Dibatalkan', component: 'Cancel', status: 'cancel'},
];

function MyTabBar({state, descriptors, navigation, position}) {
  return (
    <View style={{flexDirection: 'row', marginHorizontal: 11.5}}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // const inputRange = state.routes.map((_, i) => i);
        // const opacity = Animated.interpolate(position, {
        //   inputRange,
        //   outputRange: inputRange.map(i => (i === index ? 1 : 0)),
        // });

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={1}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isFocused ? colors.black : 'transparent',
              paddingHorizontal: sizes.ten,
              paddingVertical: 0,
              borderRadius: 99,
              borderWidth: 1,
              borderColor: isFocused ? colors.black : colors.black,
              marginHorizontal: sizes.ten - 3,
            }}>
            <Animated.Text
              style={{
                opacity: 1,
                color: isFocused ? colors.white : colors.black,
                fontSize: sizes.font12,
                textAlign: 'center',
                marginVertical: sizes.five,
              }}>
              {label}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const PesananSayaItems = ({navigation, orders}) => {
  const renderOrders = ({item}) => {
    return (
      <View style={styles.wrapper}>
        <View style={styles.rowJustify}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text type="SemiBold" size={sizes.font14}>
              Order {item.orderId}
            </Text>
          </View>

          <Text color={colors.gray} size={sizes.font12}>
            {formatDate(item.transactionTime.split(' ')[0], 'date-month-year')}
          </Text>
        </View>
        <View
          style={{
            marginTop: sizes.five,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text size={sizes.font12} color={colors.gray}>
            Resi:{' '}
          </Text>
          <Text size={sizes.font12}>{item.waybill ?? '-'}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={styles.row}>
            <Text size={sizes.font12} color={colors.gray}>
              Jumlah:{' '}
            </Text>
            <Text size={sizes.font12}>{item.count}</Text>
          </View>
          <View style={styles.row}>
            <Text size={sizes.font12} color={colors.gray}>
              Total:{' '}
            </Text>
            <Text size={sizes.font12}>
              {currencyFormat(getPriceDiskon(item.discount, item.subTotal))}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: sizes.ten,
          }}>
          <Button
            bg={colors.white}
            color={colors.black}
            title="Detail"
            rounded
            border
            small
            onPress={() => navigation.navigate('PesananDetail', {item})}
          />
          <Text size={sizes.font12} color={getStatusColor(item.status)}>
            {getStatusOrder(item.status)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.fifTeen}}
        style={{paddingVertical: sizes.five, paddingHorizontal: sizes.five}}
        renderItem={renderOrders}
        keyExtractor={(item, index) => index.toString()}
        // refreshControl={
        //   <RefreshControl refreshing={false} onRefresh={() => makeRequest()} />
        // }
      />
    </View>
  );
};

function SettingsScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

const PesananSaya = ({navigation}) => {
  const dispatch = useDispatch();
  const {orders} = useSelector(state => state.profile);

  useEffect(() => {
    makeRequest();
  }, []);

  const makeRequest = () => {
    dispatch(_fetch(CheckoutServices.getMyOrder(), false)).then(res => {
      if (res) {
        dispatch(setProfileState('orders', res.data));
      }
    });
  };

  return (
    <>
      <Header title="Pesanan Saya" center bg={colors.bg} />
      <Tab.Navigator
        initialRouteName="Pending"
        lazy
        tabBar={props => <MyTabBar {...props} />}
        swipeEnabled={true}
        // backBehavior="none"
        screenOptions={({route}) => ({
          tabBarScrollEnabled: true,
          tabBarLabelStyle: {
            fontFamily: font.Regular,
            fontSize: sizes.font12,
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.red,
          },
        })}
        style={{backgroundColor: colors.bg, paddingVertical: sizes.fifTeen}}>
        {tabs.map(({title, component, status}, index) => {
          return (
            <Tab.Screen
              key={index}
              name={component}
              // component={Categories[component]}
              options={{title: title}}
              children={() => (
                <PesananSayaItems
                  navigation={navigation}
                  orders={orders.filter(res =>
                    status == 'cancel'
                      ? res.status == 'cancel' ||
                        res.status == 'canceled' ||
                        res.status == 'expire'
                      : status == 'finish'
                      ? res.status == 'finish'
                      : res.status == 'pending' ||
                        res.status == 'settlement' ||
                        res.status == 'processing',
                  )}
                />
              )}
              // component={SettingsScreen}
            />
          );
        })}
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 0,
    // paddingBottom: sizes.fifTeen,
  },
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    // borderColor: '#e5e5e5',
    // shadowColor: '#000',
    borderColor: colors.white,
    shadowColor: colors.white,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2,
    padding: sizes.fifTeen,
    margin: sizes.ten,
    marginVertical: 7.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtUtama: {
    marginLeft: sizes.five,
    backgroundColor: colors.softgrey,
    borderRadius: 3,
    padding: 3,
  },
  rowJustify: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonUbah: {
    marginTop: sizes.ten,
  },
  shadowContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  txtBottomSheet: {
    margin: sizes.ten,
  },
});

export default PesananSaya;
