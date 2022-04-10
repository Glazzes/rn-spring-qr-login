import React from 'react';
import {Avatar, Box, HStack, Text} from 'native-base';
import {authStore} from '../store';

const Appbar: React.FC = () => {
  const user = authStore(state => state.user);

  return (
    <Box bg={'#fff'}>
      <HStack
        px={'2'}
        py={'3'}
        w={'100%'}
        alignItems={'center'}
        justifyContent={'space-between'}>
        <Text fontSize={'20'} fontWeight={'bold'}>
          {user.username}
        </Text>
        <Avatar
          bg={'amber.500'}
          source={{uri: user.profilePicture}}
          size={'9'}
        />
      </HStack>
    </Box>
  );
};

export default Appbar;
