import React, {useState} from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import {View} from 'react-native';
import {Avatar, Divider, Icon} from 'react-native-elements';
import {Header, Text} from '../../components';
import colors from '../../utils/colors';
import sizes from '../../utils/size';
import {useSelector, useDispatch} from 'react-redux';
import VersionInfo from 'react-native-version-info';
import * as ImagePicker from 'react-native-image-picker';
import {Toaster} from '../../helpers';
import {GlobalServices, ProfileServices} from '../../services';
import {_fetch} from '../../redux/actions/global';
import {setUserInfo, updateUserInfo} from '../../redux/actions/auth';

const Profile = ({navigation}) => {
  const dispatch = useDispatch();
  const {userInfo} = useSelector(state => state.auth);
  const {address, orders, reviews} = useSelector(state => state.profile);
  const [photo, setPhoto] = useState(userInfo.photoProfile);
  // console.log(userInfo);

  const toogleBottom = () => {};

  const chooseImage = () => {
    // setShowPromptFoto(false);
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.5,
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {uri: response.uri};
        console.log('response', JSON.stringify(response));
        // pushTemp(response);
        handleChangePP(response);
      }
    });
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App need access camera',
          message: 'App need access camera ' + 'so you can take some pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const chooseImageCamera = async () => {
    // setShowPromptFoto(false);
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.5,
    };

    await requestCameraPermission().then(() => {
      ImagePicker.launchCamera(options, response => {
        console.log('IMAGE', response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          alert('asdkasldlkasldasldjasdl');
        } else {
          const source = {uri: response.uri};
          console.log('response', JSON.stringify(response));
          // pushTemp(response);
          handleChangePP(response);
        }
      });
    });
  };

  const handleChangePP = req => {
    let newReq = req.assets[0];
    try {
      dispatch(_fetch(GlobalServices.uploadPhoto(newReq))).then(res => {
        if (res) {
          if (res) {
            handleChange(res.data.fullPath);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemovePP = () => {
    dispatch(setUserInfo('photoProfile', null));
    handleChange(null);
  };

  const handleChange = req => {
    dispatch(_fetch(ProfileServices.updateProfile({photoProfile: req}))).then(
      res => {
        if (res) {
          if (res) {
            // Toaster(res.message);
            dispatch(updateUserInfo(res.data));
          }
        }
      },
    );
  };

  const MenuItem = ({title, subTitle, to, end, icon}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.navigate(to)}>
        <View
          style={{
            padding: sizes.fifTeen,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            // flex: 1,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name={icon}
              type="material-community"
              color={colors.red}
              size={sizes.twentyFive}
            />
            <View style={{marginLeft: icon ? sizes.fifTeen : 0}}>
              <Text size={sizes.font14} type="SemiBold">
                {title}
              </Text>
              <Text size={sizes.font10} color={colors.gray}>
                {subTitle}
              </Text>
            </View>
          </View>
          <Icon type="material-community" name="chevron-right" />
        </View>
        {!end && <Divider />}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Header title="" noBack bg={colors.bg} />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={{paddingHorizontal: sizes.fifTeen}}>
          <Text size={sizes.twentyFive} type="SemiBold">
            Profile
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: sizes.twenty,
            }}>
            {userInfo.photoProfile ? (
              <Avatar
                size="medium"
                source={{uri: userInfo.photoProfile}}
                rounded
                overlayContainerStyle={{backgroundColor: colors.red}}>
                <Avatar.Accessory
                  type="material-community"
                  name="pencil"
                  size={sizes.fifTeen}
                  onPress={() => toogleBottom()}
                />
              </Avatar>
            ) : (
              <Avatar
                size="medium"
                rounded
                title={userInfo.firstName[0]}
                overlayContainerStyle={{backgroundColor: colors.red}}>
                <Avatar.Accessory
                  type="material-community"
                  name="pencil"
                  size={sizes.fifTeen}
                  onPress={() => toogleBottom()}
                />
              </Avatar>
            )}
            <View style={{marginLeft: sizes.fifTeen}}>
              <Text size={sizes.font16} type="SemiBold">
                {userInfo.firstName + ' ' + userInfo.lastName}
              </Text>
              <Text size={sizes.font12} color={colors.gray}>
                {userInfo.email}
              </Text>
            </View>
          </View>
        </View>
        <MenuItem
          title="Pesanan Saya"
          subTitle={
            orders.length == 0
              ? 'Belum ada pesanan'
              : `Ada ${orders.length} pesanan`
          }
          to="PesananSaya"
          icon="file-document-outline"
        />
        <MenuItem
          title="Alamat Saya"
          subTitle={
            address.length == 0
              ? 'Belum ada alamat disimpan'
              : `Ada ${address.length} alamat`
          }
          to="DaftarAlamat"
          icon="map-marker-outline"
        />
        <MenuItem
          title="Ulasan Saya"
          subTitle={
            reviews.length == 0
              ? 'Belum ada ulasan'
              : `Ada ${reviews.length} ulasan`
          }
          icon="star-outline"
        />
        {/* <MenuItem
          title="Rekening Saya"
          subTitle="Ada 12 rekening"
          icon="credit-card-outline"
        /> */}
        <MenuItem
          title="Pengaturan Akun"
          subTitle="Nama, Password, Email"
          icon="account-cog-outline"
          to="UbahProfile"
          // icon="account-settings-outline"
        />
        <MenuItem
          title="Pengaturan Sistem"
          subTitle="Notifikasi"
          icon="cog-outline"
          end
        />
        <Text
          size={sizes.font12}
          color={colors.grey}
          style={{marginTop: sizes.twenty}}
          align="center">
          versi {VersionInfo.appVersion}
        </Text>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    // paddingHorizontal: sizes.fifTeen,
  },
});

export default Profile;
