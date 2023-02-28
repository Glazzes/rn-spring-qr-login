import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

type ModalProps = {};

const Modal: React.FC<ModalProps> = ({}) => {
  return <View style={style.view} />;
};

const style = StyleSheet.create({
  view: {
    width: 200,
    height: 200,
    backgroundColor: 'orange',
  },
});

export default Modal;
