import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, FlatList, RefreshControl} from 'react-native';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Button, Header, Text, BottomSheet, Card} from '../../components';
// import Animated from 'react-native-reanimated';
import {useSelector, useDispatch} from 'react-redux';
import {ProfileServices} from '../../services';
import {_fetch} from '../../redux/actions/global';
import colors from '../../utils/colors';
import {CheckBox, Divider, Icon} from 'react-native-elements';
import {TouchableOpacity} from 'react-native';
import sizes from '../../utils/size';
import ResponsiveScreen from 'react-native-auto-responsive-screen';
import {setProfileState} from '../../redux/actions/profile';
import {font} from '../../utils';
import {useFocusEffect} from '@react-navigation/native';
import {Toaster} from '../../helpers';

// const AnimatedView = Animated.View;

const DaftarAlamat = ({navigation}) => {
  const dispatch = useDispatch();
  const {address} = useSelector(state => state.profile);
  console.log(address);
  const [addressd, setAddress] = useState([]);
  const isLoading = useSelector(state => state.global.fullscreenLoading);
  const [show, setShow] = useState(false);

  //bottom sheet
  const [detail, setDetail] = useState([]);
  const sheetRef = useRef();
  // let fall = new Animated.Value(1);

  useEffect(() => {
    makeRequest();
  }, []);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     makeRequest();
  //   });

  //   return () => {
  //     unsubscribe;
  //   };
  // }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      // makeRequest();
    }, []),
  );

  const makeRequest = () => {
    dispatch(_fetch(ProfileServices.getAddress(), false)).then(res => {
      if (res) {
        dispatch(setProfileState('address', res.data));
      }
    });
  };

  const updateMain = (id, value) => {
    dispatch(
      _fetch(ProfileServices.editAddress({isMain: value}, id), false),
    ).then(res => {
      if (res) {
        Toaster('Alamat utama berhasil diganti');
        makeRequest();
      }
      // sheetRef.current.snapTo(1),
      // setShow(false),
      // sheetRef.current.close(),}
    });
  };

  // const deleteAddress = (id) => {
  //   dispatch(_fetch(ProfileServices.deleteAddress(id), false)).then(
  //     (res) => res && makeRequest(),
  //     // sheetRef.current.snapTo(1),
  //     // setShow(false),
  //     sheetRef.current.close(),
  //   );
  // };

  const renderAddress = ({item}) => {
    return (
      <Card style={{padding: sizes.fifTeen, margin: sizes.ten}}>
        <View style={styles.rowJustify}>
          {/* <View style={styles.row}>
            <Text size={sizes.ten} type="SemiBold">
              {item.tag}
            </Text>
            {item.isMain ? (
              <View style={styles.txtUtama}>
                <Text color={colors.grey} size={sizes.ten} type="SemiBold">
                  Alamat Utama
                </Text>
              </View>
            ) : null}
          </View> */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text type="SemiBold" size={sizes.font12}>
              {item.nameReceiver}{' '}
            </Text>
            <Text type="Regular" size={sizes.font12}>
              ({item.tag})
            </Text>
          </View>
          {/* <Icon
            name="dots-vertical"
            type="material-community"
            color={colors.grey}
            onPress={() => {
              setDetail(item);
              // sheetRef.current.snapTo(0);
              // setShow(true);
              sheetRef.current.open();
            }}
          /> */}
          <Text
            color={colors.red}
            size={sizes.font12}
            onPress={() => navigation.navigate('EditAlamat', {item})}>
            Edit
          </Text>
        </View>
        {/* <Text type="SemiBold" size={sizes.font12}>
          {item.nameReceiver}
        </Text> */}
        <Text type="Light" size={sizes.font12}>
          {item.phoneReceiver}
        </Text>
        <View style={styles.row}>
          {/* <Icon
            color={colors.green}
            name="map-marker"
            type="material-community"
          /> */}
          <Text size={sizes.font12} style={{flex: 1}} align="justify">
            {item.address}, {item.cityName}, {item.provinceName}, {item.zipcode}
          </Text>
        </View>
        <CheckBox
          wrapperStyle={{
            padding: 0,
            margin: 0,
            marginHorizontal: -(sizes.ten + 2),
            marginTop: 3,
          }}
          containerStyle={{
            padding: 0,
            margin: 0,
            marginHorizontal: -20,
            backgroundColor: colors.white,
            borderWidth: 0,
          }}
          title="Alamat Utama"
          checked={item.isMain}
          iconType="material-community"
          checkedIcon="checkbox-marked"
          uncheckedIcon="checkbox-blank-outline"
          checkedColor="red"
          activeOpacity={1}
          fontFamily={font.SemiBold}
          textStyle={{fontWeight: 'normal', fontSize: sizes.font12}}
          onPress={
            item.isMain
              ? () => updateMain(item.id, 0)
              : () => updateMain(item.id, 1)
          }
        />
        {/* <Button
          title="Ubah Alamat"
          border
          bg={colors.white}
          color={colors.grey}
          style={styles.buttonUbah}
          onPress={() => navigation.navigate('EditAlamat', {item})}
        /> */}
      </Card>
    );
  };

  const renderSkeleton = () => {
    return (
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item margin={5}>
          <SkeletonPlaceholder.Item height={140} borderRadius={8} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    );
  };

  // const renderShadow = () => {
  //   const animatedShadowOpacity = Animated.interpolate(fall, {
  //     inputRange: [0, 1],
  //     outputRange: [0.6, 0],
  //   });

  //   return (
  //     <AnimatedView
  //       pointerEvents={'none'}
  //       style={[
  //         styles.shadowContainer,
  //         {
  //           opacity: animatedShadowOpacity,
  //         },
  //       ]}
  //     />
  //   );
  // };

  const renderSheetDialog = () => (
    <View>
      {/* <View
        style={{
          backgroundColor: colors.white,
          alignItems: 'center',
          // height: 30,
          justifyContent: 'center',
        }}>
        <View
          style={{
            backgroundColor: colors.green,
            height: 6,
            width: '10%',
            borderRadius: 6,
          }}
        />
      </View> */}
      <View
        style={{
          backgroundColor: colors.white,
          // height: 100,
        }}>
        {detail.isMain == 0 && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => updateMain(detail.id)}>
            <Text size={sizes.font12} style={styles.txtBottomSheet}>
              Jadikan alamat utama
            </Text>
            <Divider />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => deleteAddress(detail.id)}>
          <Text size={sizes.font12} style={styles.txtBottomSheet}>
            Hapus alamat
          </Text>
          <Divider />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => sheetRef.current.close()}>
          <Text size={sizes.font12} style={styles.txtBottomSheet}>
            Batalkan
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <Header
        title="Daftar Alamat"
        center
        // right={
        //   <Text
        //     color={colors.red}
        //     onPress={() => navigation.navigate('TambahAlamat')}>
        //     Tambah
        //   </Text>
        // }
        // bold
        // shadow
      />
      <View style={styles.container}>
        {isLoading ? (
          <FlatList
            data={Array.apply(null, Array(3))}
            renderItem={renderSkeleton}
            style={{paddingVertical: sizes.five, paddingHorizontal: sizes.five}}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <FlatList
            data={address}
            showsVerticalScrollIndicator={false}
            style={{paddingVertical: sizes.five, paddingHorizontal: sizes.five}}
            renderItem={renderAddress}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{paddingBottom: sizes.fifTeen}}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => makeRequest()}
              />
            }
            ListFooterComponent={
              <TouchableOpacity
                activeOpacity={1}
                style={styles.wrapper}
                onPress={() => navigation.navigate('TambahAlamat')}>
                <Text size={sizes.font12}>+ Tambah Alamat</Text>
              </TouchableOpacity>
            }
          />
        )}
      </View>
      <BottomSheet
        ref={sheetRef}
        // height={Dimensions.get('screen').height / 2}
        closeOnDragDown={true}
        closeOnPressMask={true}
        topBarStyle={{
          width: sizes.thirtyFive,
          height: 5,
          borderRadius: 2.5,
        }}
        height={ResponsiveScreen.normalize(150)}
        closeOnHardwareBack={true}
        // backDropStyle={{elevation: 5}}
        sheetStyle={{borderRadius: sizes.fifTeen}}>
        {renderSheetDialog()}
      </BottomSheet>
      {/* <BottomSheet
        initialSnap={1}
        ref={sheetRef}
        snapPoints={[130, 0]}
        borderRadius={10}
        callbackNode={fall}
        renderContent={renderSheetDialog}
        enabledManualSnapping={false}
      /> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 0,
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

export default DaftarAlamat;
