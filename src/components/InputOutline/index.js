import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {KeyboardAvoidingView} from 'react-native';
import ResponsiveScreen from 'react-native-auto-responsive-screen';
import {Input} from 'react-native-elements';
import {Text} from '..';
import {font} from '../../utils';
import colors from '../../utils/colors';
import sizes from '../../utils/size';

const InputOutline = ({
  style,
  hide,
  password,
  errorMessage,
  placeholder,
  label,
  ...otherProps
}) => {
  const [isFocus, setIsFocus] = useState(false);

  const focusChange = (val) => (e) => setIsFocus(val);

  return (
    <KeyboardAvoidingView
      style={[
        style,
        styles.container,
        {
          // marginBottom: errorMessage ? 0 : 15,
          marginBottom: errorMessage ? 0 : ResponsiveScreen.normalize(10),
        },
      ]}>
      <Input
        containerStyle={{
          backgroundColor: colors.white,
          borderRadius: ResponsiveScreen.normalize(5),
          paddingTop: isFocus
            ? ResponsiveScreen.normalize(15)
            : ResponsiveScreen.normalize(10),
          paddingBottom: ResponsiveScreen.normalize(8),
          paddingHorizontal: ResponsiveScreen.normalize(15),
          // elevation: 3,
          borderWidth: 1,
          borderColor: '#e5e5e5',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
        }}
        secureTextEntry={password ? true : false}
        autoCapitalize={'none'}
        placeholder={isFocus ? 'Masukkan ' + placeholder : placeholder}
        label={isFocus ? label : null}
        {...otherProps}
        inputStyle={styles.input}
        onFocus={focusChange(true)}
        onBlur={focusChange(false)}
        inputContainerStyle={{
          borderWidth: 0,
          borderColor: 'transparent',
          marginBottom: -sizes.twentyFive,
          // padding: 0,
        }}
        labelStyle={[
          styles.label,
          {
            color: isFocus ? colors.green : colors.grey,
            fontSize: ResponsiveScreen.fontSize(12),
          },
        ]}
        errorStyle={styles.inputError}
      />
      {errorMessage && (
        <Text size={10} color={colors.red}>
          {errorMessage}
        </Text>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginHorizontal: 10,
  },
  input: {
    fontSize: 12,
    fontFamily: font.Regular,
    padding: 0,
  },
  inputError: {
    fontSize: 12,
    fontFamily: font.Light,
    marginHorizontal: 0,
  },
  container: {
    // marginBottom: 20,
  },
  label: {
    fontFamily: font.Regular,
  },
});

export default InputOutline;
