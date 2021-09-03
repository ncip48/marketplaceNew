import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {View} from 'react-native';
import {Text} from '../../components';
import {getFirebaseToken, Toaster} from '../../helpers';
import colors from '../../utils/colors';
import sizes from '../../utils/size';
import {useDispatch} from 'react-redux';
import {_fetch} from '../../redux/actions/global';
import {
  HomeServices,
  GlobalServices,
  ProfileServices,
  CheckoutServices,
} from '../../services';
import {setHomeState} from '../../redux/actions/home';
import {setRegionState} from '../../redux/actions/region';
import {setProfileState} from '../../redux/actions/profile';

const Splash = ({navigation}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      callAllApi();
    } catch (error) {
      Toaster(error);
    }
  }, []);

  const callAllApi = async () => {
    await updateToken();
    await getHome();
    await getAddress();
    await getOrders();
    await getCart();
    await getFavorit();
    await getRegion();
  };

  const getAddress = async () => {
    await dispatch(_fetch(ProfileServices.getAddress(), false)).then(res => {
      if (res) {
        dispatch(setProfileState('address', res.data));
      }
    });
  };

  const getCart = async () => {
    await dispatch(_fetch(ProfileServices.getCart(), false)).then(res => {
      if (res) {
        dispatch(setProfileState('cart', res.data));
      }
    });
  };

  const getFavorit = async () => {
    await dispatch(_fetch(ProfileServices.getFavorit(), false)).then(res => {
      if (res) {
        dispatch(setProfileState('favorit', res.data));
      }
    });
  };

  const getOrders = async () => {
    await dispatch(_fetch(CheckoutServices.getMyOrder(), false)).then(res => {
      if (res) {
        dispatch(setProfileState('orders', res.data));
      }
    });
  };

  const getRegion = async () => {
    await dispatch(_fetch(GlobalServices.getProvince(), false)).then(res => {
      if (res) {
        dispatch(setRegionState('province', res.data));
      }
    });
    await dispatch(_fetch(GlobalServices.getCities(), false)).then(res => {
      if (res) {
        dispatch(setRegionState('city', res.data));
      }
    });
    await navigation.replace('Home');
  };

  const getHome = async () => {
    dispatch(_fetch(HomeServices.getHome(), false)).then(res => {
      if (res) {
        // setCategoy(res.data.categories);
        // setBrands(res.data.brands.splice(1, res.data.brands.length));
        // setBrand(res.data.brands[0]);
        // setProduct(res.data.products);
        // console.log(res.data);
        dispatch(setHomeState('banner', res.data.banners));
        dispatch(setHomeState('discount', res.data.discount));
        dispatch(setHomeState('newestProducts', res.data.newestProduct));
        dispatch(setHomeState('terlaris', res.data.terlaris));
        //   setProductDiscount(res.data.discount);
        //   addBanner(res.data.banners);
        //   setProductNewest(res.data.newestProduct);
      }
    });
  };

  const updateToken = async () => {
    const token_firebase = await getFirebaseToken();
    console.log(token_firebase);
  };

  return (
    <>
      <StatusBar backgroundColor={colors.red} barStyle="light-content" />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.red,
        }}>
        <ActivityIndicator size={sizes.font26} color={colors.white} />
        <Text size={sizes.font22} color={colors.white}>
          Loading
        </Text>
      </View>
    </>
  );
};

export default Splash;
