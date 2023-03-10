import {Text, Pressable, StyleSheet, Keyboard, ViewStyle} from 'react-native';
import React, {useState} from 'react';

type ButtonAction = 'accept' | 'decline';

type ButtonProps = {
  action: ButtonAction;
  width: number;
  text: string;
  onPress: () => Promise<void>;
  disabled?: boolean;
  extraStyle?: ViewStyle;
};

const Button: React.FC<ButtonProps> = ({
  action,
  width,
  text,
  disabled,
  onPress,
  extraStyle,
}) => {
  const [isPerformingAction, setIsPerformingAction] = useState<boolean>(false);

  const onPressWrapper = async () => {
    Keyboard.dismiss();

    setIsPerformingAction(true);
    await onPress();
    setIsPerformingAction(false);
  };

  return (
    <Pressable
      onPress={onPressWrapper}
      style={[
        styles.button,
        action === 'accept' ? styles.acceptButton : styles.declineButton,
        isPerformingAction || disabled ? styles.disabledButton : undefined,
        {width},
        extraStyle,
      ]}>
      <Text
        style={[
          styles.text,
          action === 'accept'
            ? styles.acceptButtonText
            : styles.declineButtonText,
          isPerformingAction || disabled
            ? styles.disabledButtonText
            : undefined,
        ]}>
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    height: 40,
  },
  acceptButton: {
    backgroundColor: '#3366ff',
  },
  declineButton: {
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#E94560',
  },
  disabledButton: {
    backgroundColor: '#EDF1F7',
    borderWidth: 0,
  },
  text: {
    fontWeight: 'bold',
  },
  acceptButtonText: {
    color: '#fff',
  },
  declineButtonText: {
    color: '#E94560',
  },
  disabledButtonText: {
    color: '#c3c3c3',
  },
});

export default Button;
