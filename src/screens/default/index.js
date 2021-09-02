import React from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {View} from 'react-native';
import {Header, Text} from '../../components';
import colors from '../../utils/colors';

const default = () => {
  return (
    <>
      <Header
        title="Daftar Alamat"
        right={<Text color={colors.green}>Tambah Alamat</Text>}
      />
      <FlatList />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default default;
