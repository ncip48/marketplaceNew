import React, {useState, useEffect} from 'react';
import {StyleSheet, FlatList, Dimensions} from 'react-native';
import {View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {ProfileServices} from '../../services';
import {_fetch} from '../../redux/actions/global';
import {Divider, Icon, CheckBox, Image} from 'react-native-elements';
import {Button, Card, Header, Text} from '../../components';
import colors from '../../utils/colors';
import {currencyFormat, getPriceDiskon} from '../../helpers';
import {setProfileState} from '../../redux/actions/profile';
import {useFocusEffect} from '@react-navigation/native';
import {sizes} from '../../utils';
import {ActivityIndicator} from 'react-native-paper';

const Favorit = () => {
  const dispatch = useDispatch();
  const {favorit} = useSelector(state => state.profile);

  useFocusEffect(
    React.useCallback(() => {
      getFavorit();
    }, []),
  );

  const getFavorit = () => {
    dispatch(_fetch(ProfileServices.getFavorit(), false)).then(res => {
      if (res) {
        dispatch(setProfileState('favorite', res.data));
      }
    });
  };

  const onRefresh = () => {
    getFavorit();
  };

  const renderItem = ({item, index}) => {
    return (
      <Card style={{margin: sizes.ten}}>
        <View style={[styles.row]}>
          <View style={styles.row}>
            <Image
              source={{uri: JSON.parse(item.product.images)[0]}}
              style={{
                width: sizes.twentyFive * 3.5,
                height: sizes.twentyFive * 3.5,
                // borderRadius: 8,
                // backgroundColor: 'red',
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              }}
              placeholderStyle={{backgroundColor: colors.white}}
              PlaceholderContent={
                <ActivityIndicator color={colors.red} size={sizes.fifTeen} />
              }
              resizeMode="contain"
            />
          </View>
          <View style={{padding: sizes.ten, flex: 1}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                size={sizes.font14}
                type="Regular"
                style={{flex: 1}}
                numberOfLines={2}>
                {item.product.nameProduct}
              </Text>
              <Icon
                type="material-community"
                name="close"
                size={sizes.twenty}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: sizes.ten,
              }}>
              <View>
                {item.product.discount > 0 && (
                  <Text color={colors.black} type="Bold" size={sizes.font12}>
                    {currencyFormat(
                      getPriceDiskon(item.product.discount, item.product.price),
                    )}
                  </Text>
                )}
                <Text
                  style={
                    item.product.discount > 0
                      ? {
                          textDecorationLine: 'line-through',
                          textDecorationStyle: 'solid',
                          // marginBottom: sizes.five,
                          // marginHorizontal: sizes.ten,
                        }
                      : {}
                  }
                  color={item.product.discount > 0 ? colors.gray : colors.black}
                  size={item.product.discount > 0 ? sizes.font10 : sizes.font12}
                  type={item.product.discount > 0 ? 'Regular' : 'Bold'}>
                  {item.product.discount > 0
                    ? currencyFormat(parseInt(item.product.price))
                    : currencyFormat(parseInt(item.product.price))}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <>
      <Header noBack bg={colors.bg} />
      <View style={styles.container}>
        <View style={{paddingHorizontal: sizes.fifTeen}}>
          <Text size={sizes.twentyFive} type="SemiBold">
            Favorit
          </Text>
        </View>
        <FlatList
          data={favorit}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          onRefresh={() => onRefresh()}
          refreshing={false}
          style={{
            paddingVertical: sizes.five,
            paddingHorizontal: sizes.five,
            paddingTop: 0,
          }}
          contentContainerStyle={{flexGrow: 1}}
          ListEmptyComponent={
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text align="center" size={sizes.font12}>
                Tidak ada favorit
              </Text>
            </View>
          }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  img: {
    height: 75,
    width: 75,
    overflow: 'hidden',
    borderRadius: 5,
  },
  txtDiscount: {
    borderRadius: 3,
    paddingHorizontal: 5,
    backgroundColor: colors.grey,
    marginRight: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowUp: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rowSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  delText: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    marginRight: 5,
  },
  footer: {
    marginTop: 1,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowColor: '#000000',
    elevation: 4,

    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 15,
  },
  top: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 4,
    margin: 10,
  },
  qty: {
    height: 15,
    width: 15,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Favorit;
