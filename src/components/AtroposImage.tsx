'use client';

import Atropos from 'atropos/react';
import Image from 'next/image';
import { ReactNode } from 'react';
import 'atropos/css';

interface AtroposImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  // Atropos settings
  activeOffset?: number;
  shadowScale?: number;
  shadow?: boolean;
  highlight?: boolean;
  rotateXMax?: number;
  rotateYMax?: number;
  rotateTouch?: boolean | 'scroll-y' | 'scroll-x';
  // Parallax layers
  children?: ReactNode;
}

export function AtroposImage({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes,
  className = '',
  containerClassName = '',
  priority = false,
  activeOffset = 50,
  shadowScale = 1.05,
  shadow = true,
  highlight = true,
  rotateXMax = 15,
  rotateYMax = 15,
  rotateTouch = 'scroll-y',
  children,
}: AtroposImageProps) {
  return (
    <Atropos
      className={`atropos-image ${containerClassName}`}
      activeOffset={activeOffset}
      shadowScale={shadowScale}
      shadow={shadow}
      highlight={highlight}
      rotateXMax={rotateXMax}
      rotateYMax={rotateYMax}
      rotateTouch={rotateTouch}
    >
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={className}
          priority={priority}
          data-atropos-offset="0"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          priority={priority}
          style={{ width: '100%', height: 'auto' }}
          data-atropos-offset="0"
        />
      )}
      {children}
    </Atropos>
  );
}

interface AtroposCardProps {
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  // Atropos settings
  activeOffset?: number;
  shadowScale?: number;
  shadow?: boolean;
  highlight?: boolean;
  rotateXMax?: number;
  rotateYMax?: number;
  rotateTouch?: boolean | 'scroll-y' | 'scroll-x';
}

export function AtroposCard({
  className = '',
  containerClassName = '',
  children,
  activeOffset = 40,
  shadowScale = 1.05,
  shadow = true,
  highlight = true,
  rotateXMax = 10,
  rotateYMax = 10,
  rotateTouch = 'scroll-y',
}: AtroposCardProps) {
  return (
    <Atropos
      className={`atropos-card ${containerClassName}`}
      activeOffset={activeOffset}
      shadowScale={shadowScale}
      shadow={shadow}
      highlight={highlight}
      rotateXMax={rotateXMax}
      rotateYMax={rotateYMax}
      rotateTouch={rotateTouch}
    >
      <div className={className}>
        {children}
      </div>
    </Atropos>
  );
}

interface AtroposGalleryImageProps {
  images: string[];
  alt: string;
  sizes?: string;
  className?: string;
  // Atropos settings
  activeOffset?: number;
  shadowScale?: number;
  rotateXMax?: number;
  rotateYMax?: number;
}

export function AtroposGalleryImage({
  images,
  alt,
  sizes = '(max-width: 1280px) 80vw, 60rem',
  className = '',
  activeOffset = 60,
  shadowScale = 1.08,
  rotateXMax = 12,
  rotateYMax = 12,
}: AtroposGalleryImageProps) {
  return (
    <Atropos
      className={`atropos-gallery ${className}`}
      activeOffset={activeOffset}
      shadowScale={shadowScale}
      shadow={true}
      highlight={true}
      rotateXMax={rotateXMax}
      rotateYMax={rotateYMax}
      rotateTouch="scroll-y"
    >
      {images[0] && (
        <div className="atropos-gallery__layer atropos-gallery__layer--back" data-atropos-offset="-5">
          <Image
            src={images[0]}
            alt={`${alt} - Background`}
            fill
            sizes={sizes}
          />
        </div>
      )}
      {images[1] && (
        <div className="atropos-gallery__layer atropos-gallery__layer--front" data-atropos-offset="5">
          <Image
            src={images[1]}
            alt={`${alt} - Foreground`}
            fill
            sizes={sizes}
          />
        </div>
      )}
    </Atropos>
  );
}
