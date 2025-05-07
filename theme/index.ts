import { extendTheme } from '@chakra-ui/react';

const spacing = {
  space: {
    px: '1px',
  },
};

const theme = extendTheme({ ...spacing });

export default theme;
