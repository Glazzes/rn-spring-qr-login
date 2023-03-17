import React, {useEffect} from 'react';
import {BackHandler} from 'react-native';

export default function withBlockedReturn<T>(
  WrappedComponent: React.ComponentType<T>,
): React.FC<T> {
  const EnhancedKeyboardComponent: React.FC<T> = props => {
    useEffect(() => {
      const listener = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );

      return () => {
        listener.remove();
      };
    }, []);

    return <WrappedComponent {...props} />;
  };

  return EnhancedKeyboardComponent;
}
