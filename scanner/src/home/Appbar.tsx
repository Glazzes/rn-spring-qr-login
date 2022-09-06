import React from 'react';
import {Avatar, Box, HStack, Text} from 'native-base';
import {useSnapshot} from 'valtio';
import {authState} from '../store/authStore';

const Appbar: React.FC = () => {
  const snap = useSnapshot(authState);

  return (
    <Box bg={'#fff'}>
      <HStack
        px={'2'}
        py={'3'}
        w={'100%'}
        alignItems={'center'}
        justifyContent={'space-between'}>
        <Text fontSize={'20'} fontWeight={'bold'}>
          {snap.user.username}
        </Text>
        <Avatar
          bg={'amber.500'}
          source={{uri: snap.user.profilePicture}}
          size={'9'}
        />
      </HStack>
    </Box>
  );
};

export default Appbar;
