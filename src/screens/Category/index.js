import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {HomeServices} from '../../services';
import {currencyFormat} from '../../helpers';
import {_fetch} from '../../redux/actions/global';
import {Text} from '../../components';

const Category = ({navigation}) => {
  const isLoading = useSelector((state) => state.global.fullscreenLoading);
  const dispatch = useDispatch();
  const [category, setCategoy] = useState([]);

  const navigate = (to, payload) => (e) => navigation.navigate(to, payload);

  useEffect(() => {
    dispatch(_fetch(HomeServices.getHome())).then(
      (res) => res && setCategoy(res.data),
    );
  }, []);
  return (
    <View>
      {isLoading ? (
        <Text>Loadinggg...</Text>
      ) : (
        category.map((data) => (
          <View style={styles.categoryContainer}>
            <View style={styles.kategoriWrapper}>
              <Text style={styles.kategoriLeft} size={14}>
                {data.name}
              </Text>
              <Text
                style={styles.kategoriRight}
                onPress={navigate('Kategori Produk', {
                  item: data,
                })}
                color="green">
                lihat semua
              </Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={data.products}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Produk Detail', {
                      item: item,
                    })
                  }
                  style={styles.Pembungkus}
                  activeOpacity={1}>
                  <Image
                    style={styles.ImageComponentStyle}
                    source={{
                      uri: item.imagePhoto,
                    }}
                    onPress={() =>
                      this.props.navigation.navigate('Produk Detail', {
                        item: item,
                      })
                    }
                  />
                  <Text
                    style={styles.Judul}
                    onPress={() =>
                      this.props.navigation.navigate('Produk Detail', {
                        item: item,
                      })
                    }>
                    {item.nameProduct.length > 15
                      ? item.nameProduct.substring(0, 15) + '...'
                      : item.nameProduct}
                  </Text>
                  <Text style={styles.Harga}>
                    {currencyFormat(parseInt(item.price))}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index}
              contentContainerStyle={{margin: 5, marginTop: 0}}
            />
            <View
              style={{
                borderBottomColor: '#e5e5e5',
                borderBottomWidth: 15,
                marginTop: 10,
              }}
            />
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //justifyContent: 'center',
    flex: 1,
    backgroundColor: '#e5e5e5',
  },
  categoryContainer: {
    marginBottom: 15,
    backgroundColor: 'white',
    paddingVertical: 15,
  },
  kategoriWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 15,
  },
  kategoriRight: {
    marginLeft: 'auto',
    textDecorationLine: 'underline',
  },
  wrapperItem: {
    paddingHorizontal: 10,
    paddingVertical: 0,
    margin: 0,
  },
  wrapperProduct: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  txtSemua: {
    marginHorizontal: 5,
    marginBottom: 10,
    marginTop: 5,
  },
});

export default Category;
