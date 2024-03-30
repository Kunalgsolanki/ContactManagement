import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';

const NetworkIssuePage = () => {
  return (
    <Box textAlign="center" mt="20">
      <Text fontSize="2xl" mb="4">
        Oops! {"There 's"} a network issue.
      </Text>
      <Text fontSize="lg" mb="8">
        Please check your internet connection and try again.
      </Text>
      <Button colorScheme="blue" onClick={()=>{ window.location.reload();}}>
        Retry
      </Button>
    </Box>
  );
};

export default NetworkIssuePage;
