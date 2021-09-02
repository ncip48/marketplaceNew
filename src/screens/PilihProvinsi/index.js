import React, {useState, useEffect} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useSelector, useDispatch} from 'react-redux';
import GlobalServices from '../../services/GlobalServices';
import {_fetch} from '../../redux/actions/global';
import {Header, Text} from '../../components';
import colors from '../../utils/colors';
import {Divider} from 'react-native-elements';
import {TouchableOpacity} from 'react-native';

const PilihProvinsi = ({navigation, route}) => {
  const {province} = useSelector((state) => state.region);
  const {params} = route;
  const dispatch = useDispatch();
  // const [province, setProvince] = useState([]);
  // const isLoading = useSelector((state) => state.global.fullscreenLoading);

  // useEffect(() => {
  //   dispatch(_fetch(GlobalServices.getProvince())).then(
  //     (res) => res && setProvince(res.data),
  //   );
  // }, []);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          navigation.navigate(params.source, {
            province: item.province_id + '#' + item.province,
          })
        }>
        <Text size={12} style={styles.text}>
          {item.province}
        </Text>
        <Divider />
      </TouchableOpacity>
    );
  };

  const renderSkeleton = () => {
    return (
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item margin={5}>
          <SkeletonPlaceholder.Item
            height={25}
            width={Math.floor(Math.random() * 100) + 50}
            borderRadius={3}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    );
  };

  return (
    <>
      <Header title="Pilih Provinsi" shadow />
      <View style={styles.container}>
        {/* {isLoading ? (
          <FlatList
            data={Array.apply(null, Array(20))}
            renderItem={renderSkeleton}
            showsVerticalScrollIndicator={false}
            style={{paddingVertical: 5, paddingHorizontal: 5}}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : ( */}
        <FlatList
          data={province}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
        />
        {/* )} */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  text: {
    padding: 10,
  },
});

export default PilihProvinsi;
