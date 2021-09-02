import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {KeyboardAvoidingView} from 'react-native';
import ResponsiveScreen from 'react-native-auto-responsive-screen';
import {Input} from 'react-native-elements';
import {font} from '../../utils';
import colors from '../../utils/colors';
import sizes from '../../utils/size';

const CustomInput = ({style, hide, password, errorMessage, ...otherProps}) => {
  const [isFocus, setIsFocus] = useState(false);

  const focusChange = (val) => (e) => setIsFocus(val);

  return (
    <KeyboardAvoidingView
      style={[style, styles.container, {marginBottom: errorMessage ? 0 : 15}]}>
      <Input
        secureTextEntry={password ? true : false}
        autoCapitalize={'none'}
        {...otherProps}
        inputStyle={styles.input}
        onFocus={focusChange(true)}
        onBlur={focusChange(false)}
        errorMessage={errorMessage}
        inputContainerStyle={{
          borderColor: isFocus ? colors.red : colors.softgrey,
          paddingBottom: 0,
          marginBottom: -sizes.twentyFive,
        }}
        containerStyle={
          {
            // backgroundColor: 'red',
            // marginBottom: -10,
            // paddingBottom: -10,
          }
        }
        // style={{paddingBottom: -10, marginBottom: -10}}
        labelStyle={[
          styles.label,
          {
            color: isFocus ? colors.red : colors.grey,
            fontSize: ResponsiveScreen.fontSize(12),
          },
        ]}
        errorStyle={styles.inputError}
        // placeholder={hide ? (isFocus ? null : placeholder) : placeholder}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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

export default CustomInput;
