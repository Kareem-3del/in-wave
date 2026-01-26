'use client';

import type { BoxProps } from '@mui/material/Box';

import { forwardRef } from 'react';

import Box from '@mui/material/Box';

import { logoClasses } from './classes';
import { SxProps } from '@mui/material';

// ----------------------------------------------------------------------

export type LogoProps = BoxProps & {
  href?: string;
  isSingle?: boolean;
  isWhite?: boolean;
  disableLink?: boolean;
  width?: string | number
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    { width, href = '/', height, isWhite = false, isSingle = true, disableLink = false, className, sx, ...other },
    ref
  ) => {

    return (
      <Box
        ref={ref}
        className={logoClasses.root.concat(className ? ` ${className}` : '')}
        aria-label="Logo"
        sx={{
          width: { xs: 90 },
          flexShrink: 0,
          display: 'inline-flex',
          verticalAlign: 'middle',
          ...(disableLink && { pointerEvents: 'none' }),
          ...sx,
        }}
        {...other}
      >
        <Box
          alt="Full logo"
          component="img"
          src="/images/logo.svg"
          width="100%"
          height="100%"
        />
      </Box>
    );
  }
);

Logo.displayName = 'Logo';
