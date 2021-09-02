import React, {Component} from 'react';
import {StatusBar, TouchableWithoutFeedback} from 'react-native';
import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import colors from '../../utils/colors';
import sizes from '../../utils/size';
import CustomButton from '../CustomButton';
import CustomText from '../CustomText';

class ErrorSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panY: new Animated.Value(Dimensions.get('screen').height),
    };
    this._resetPositionAnim = Animated.timing(this.state.panY, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    });
    this._closeAnim = Animated.timing(this.state.panY, {
      toValue: Dimensions.get('screen').height,
      duration: 300,
      useNativeDriver: false,
    });
    this._panResponders = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: Animated.event([null, {dy: this.state.panY}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gs) => {
        if (gs.dy > 0 && gs.vy > 2) {
          return this._closeAnim.start(() => this.props.onDismiss());
        }
        return this._resetPositionAnim.start();
      },
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.visible !== this.props.visible && this.props.visible) {
      this._resetPositionAnim.start();
    }
  }
  _handleDismiss() {
    this._closeAnim.start(() => this.props.onDismiss());
  }

  render() {
    const top = this.state.panY.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [0, 0, 1],
    });

    return (
      <Modal
        animated
        animationType="fade"
        visible={this.props.visible}
        transparent
        onRequestClose={() => this._handleDismiss()}>
        {/* <TouchableWithoutFeedback onPress={() => this._handleDismiss()}> */}
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.container,
              {top, flex: this.props.fullScreen ? 1 : 0},
            ]}
            onPress={null}>
            <View
              style={{
                backgroundColor: colors.white,
                paddingHorizontal: sizes.twenty,
                paddingTop: sizes.five,
                paddingBottom: sizes.twenty,
              }}>
              <CustomText
                type="Bold"
                size={sizes.font14}
                style={{marginBottom: sizes.five}}>
                {this.props?.error?.message}
              </CustomText>
              <CustomText
                size={sizes.font12}
                align="justify"
                style={{marginBottom: sizes.five}}>
                {this.props?.error?.details}
              </CustomText>
              <CustomButton
                small
                title="Ok"
                rounded
                style={{alignSelf: 'flex-end'}}
                onPress={() => this._handleDismiss()}
              />
            </View>
          </Animated.View>
        </View>
        {/* </TouchableWithoutFeedback> */}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.white,
    paddingTop: sizes.fifTeen,
    borderTopRightRadius: sizes.fifTeen,
    borderTopLeftRadius: sizes.fifTeen,
    // height: Dimensions.get('screen').height - StatusBar.currentHeight,
  },
});

export default ErrorSheet;
