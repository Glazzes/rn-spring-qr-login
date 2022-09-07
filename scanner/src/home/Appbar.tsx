import React, {useEffect} from 'react';
import {Avatar, Box, HStack, Text} from 'native-base';
import {useSnapshot} from 'valtio';
import {authState, setUser} from '../store/authStore';
import axios from 'axios';
import {me} from '../utils/urls';
import {User} from '../utils/types';

const Appbar: React.FC = () => {
  const snap = useSnapshot(authState);

  useEffect(() => {
    axios
      .get(me, {headers: {Authorization: snap.accessToken}})
      .then(({data}: {data: User}) => setUser(data))
      .catch(() => console.log('Could not fetch'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box bg={'#fff'}>
      <HStack
        px={'2'}
        py={'3'}
        w={'100%'}
        alignItems={'center'}
        justifyContent={'space-between'}>
        <Text fontSize={'20'} fontWeight={'bold'} textTransform={'capitalize'}>
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
