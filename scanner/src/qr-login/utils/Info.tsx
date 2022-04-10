import {Text} from 'native-base';
import React from 'react';

type InfoProps = {
  text: string;
};

const Info: React.FC<InfoProps> = ({text}) => {
  return (
    <Text
      textAlign={'center'}
      color={'#4e4e4e'}
      fontSize={'14'}
      fontWeight={'semibold'}>
      {text}
    </Text>
  );
};

export default Info;
