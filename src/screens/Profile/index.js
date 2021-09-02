import React from 'react';
import {StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {Avatar, Divider, Icon} from 'react-native-elements';
import {Header, Text} from '../../components';
import colors from '../../utils/colors';
import sizes from '../../utils/size';
import {useSelector} from 'react-redux';
import {ScrollView} from 'react-native';

const Profile = ({navigation}) => {
  const {userInfo} = useSelector((state) => state.auth);
  const {address, orders} = useSelector((state) => state.profile);
  // console.log(userInfo);

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
            <Avatar
              size="medium"
              rounded
              title={userInfo.firstName[0]}
              overlayContainerStyle={{backgroundColor: colors.red}}
            />
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
          subTitle={`Ada ${orders.length} pesanan`}
          to="PesananSaya"
          icon="file-document-outline"
        />
        <MenuItem
          title="Alamat Saya"
          subTitle={`Ada ${address.length} alamat`}
          to="DaftarAlamat"
          icon="map-marker-outline"
        />
        <MenuItem
          title="Ulasan Saya"
          subTitle="Ada 12 ulasan"
          icon="star-outline"
        />
        <MenuItem
          title="Rekening Saya"
          subTitle="Ada 12 rekening"
          icon="credit-card-outline"
        />
        <MenuItem
          title="Pengaturan Akun"
          subTitle="Nama, Password, Email"
          icon="account-cog-outline"
          // icon="account-settings-outline"
        />
        <MenuItem
          title="Pengaturan Sistem"
          subTitle="Notifikasi"
          icon="cog-outline"
          end
        />
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
