import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import { Logo } from './logo';



// ----------------------------------------------------------------------

export type AnimateLogoProps = BoxProps & {
  logo?: React.ReactNode;
};

export function AnimateLogo1({ logo, sx, ...other }: AnimateLogoProps) {
  return (
    <Box
      sx={{
        width: 120,
        height: 120,
        alignItems: 'center',
        position: 'relative',
        display: 'inline-flex',
        justifyContent: 'center',
        ...sx,
      }}
      {...other}
    >
      <Box
        component={m.div}
        animate={{ scale: [1, 0.9, 0.9, 1, 1], opacity: [1, 0.48, 0.48, 1, 1] }}
        transition={{
          duration: 2,
          repeatDelay: 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        sx={{ display: 'inline-flex' }}
      >
        {logo ?? <Logo isSingle={false} disableLink width={64} height={64} />}
      </Box>

      <Box
        component={m.div}
        animate={{
          scale: [1.6, 1, 1, 1.6, 1.6],
          rotate: [270, 0, 0, 270, 270],
          opacity: [0.25, 1, 1, 1, 0.25],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
        sx={{
          position: 'absolute',
          width: 'calc(100% - 20px)',
          height: 'calc(100% - 20px)',
          border: 'solid 8px rgba(229, 204, 168, 0.24)',
        }}
      />

      <Box
        component={m.div}
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 270, 270, 0, 0],
          opacity: [1, 0.25, 0.25, 0.25, 1],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
        sx={{
          width: 1,
          height: 1,
          position: 'absolute',
          border: 'solid 8px rgba(229, 204, 168, 0.24)',
        }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

function varAlpha(color: string, opacity = 1) {
  const unsupported =
    color.startsWith('#') ||
    color.startsWith('rgb') ||
    color.startsWith('rgba') ||
    (!color.includes('var') && color.includes('Channel'));

  if (unsupported) {
    throw new Error(
      `[Alpha]: Unsupported color format "${color}".
       Supported formats are:
       - RGB channels: "0 184 217".
       - CSS variables with "Channel" prefix: "var(--palette-common-blackChannel, #000000)".
       Unsupported formats are:
       - Hex: "#00B8D9".
       - RGB: "rgb(0, 184, 217)".
       - RGBA: "rgba(0, 184, 217, 1)".
       `
    );
  }

  return `rgba(${color} / ${opacity})`;
}
