import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import { Logo } from './logo';

export type AnimateLogoProps = BoxProps & {
    logo?: React.ReactNode;
};

export function AnimateLogoCSS({ logo, sx, ...other }: AnimateLogoProps) {
    return (
        <Box
            sx={{
                width: 120,
                height: 120,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                ...sx,
            }}
            {...other}
        >
            {/* Logo with pulsate animation */}
            <Box
                sx={{
                    display: 'inline-flex',
                    animation: 'logoPulsate 2s ease-in-out infinite',
                    '@keyframes logoPulsate': {
                        '0%': { transform: 'scale(1)', opacity: 1 },
                        '25%': { transform: 'scale(0.9)', opacity: 0.48 },
                        '50%': { transform: 'scale(0.9)', opacity: 0.48 },
                        '75%': { transform: 'scale(1)', opacity: 1 },
                        '100%': { transform: 'scale(1)', opacity: 1 },
                    },
                }}
            >
                {logo ?? <Logo isSingle={false} disableLink width={64} height={64} />}
            </Box>

            {/* Outer animated border */}
            <Box
                sx={{
                    position: 'absolute',
                    width: 'calc(100% - 20px)',
                    height: 'calc(100% - 20px)',
                    border: '8px solid rgba(229, 204, 168, 0.24)',
                    borderRadius: '25%',
                    animation: 'outerBorder 3.2s linear infinite',
                    '@keyframes outerBorder': {
                        '0%': { transform: 'scale(1.6) rotate(270deg)', opacity: 0.25, borderRadius: '25%' },
                        '25%': { transform: 'scale(1) rotate(0deg)', opacity: 1, borderRadius: '25%' },
                        '50%': { transform: 'scale(1) rotate(0deg)', opacity: 1, borderRadius: '50%' },
                        '75%': { transform: 'scale(1.6) rotate(270deg)', opacity: 1, borderRadius: '50%' },
                        '100%': { transform: 'scale(1.6) rotate(270deg)', opacity: 0.25, borderRadius: '25%' },
                    },
                }}
            />

            {/* Inner animated border */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    border: '8px solid rgba(229, 204, 168, 0.24)',
                    borderRadius: '25%',
                    animation: 'innerBorder 3.2s linear infinite',
                    '@keyframes innerBorder': {
                        '0%': { transform: 'scale(1) rotate(0deg)', opacity: 1, borderRadius: '25%' },
                        '25%': { transform: 'scale(1.2) rotate(270deg)', opacity: 0.25, borderRadius: '25%' },
                        '50%': { transform: 'scale(1.2) rotate(270deg)', opacity: 0.25, borderRadius: '50%' },
                        '75%': { transform: 'scale(1) rotate(0deg)', opacity: 0.25, borderRadius: '50%' },
                        '100%': { transform: 'scale(1) rotate(0deg)', opacity: 1, borderRadius: '25%' },
                    },
                }}
            />
        </Box>
    );
}
