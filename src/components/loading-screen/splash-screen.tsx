'use client';

import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import { AnimateLogo1 } from './animate-logo';
import { AnimateLogoCSS } from './AnimateLogoCSS';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  portal?: boolean;
};

export function SplashScreen({ portal = true, sx, ...other }: Props) {
  const content = (
    <Box sx={{ overflow: 'hidden' }} className="preloader">
      <Box
        sx={{
          right: 0,
          width: 1,
          bottom: 0,
          height: 1,
          zIndex: 9998,
          display: 'flex',
          position: 'fixed',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#000',
          ...sx,
        }}
        {...other}
      >
        <AnimateLogoCSS />
      </Box>
    </Box>
  );

  if (portal) {
    return <Portal>{content}</Portal>;
  }

  return content;
}
