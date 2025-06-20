
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useClickSound } from '@/utils/soundUtils';

interface SoundButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const SoundButton = ({ children, onClick, ...props }: SoundButtonProps) => {
  const { playClickSound } = useClickSound();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClickSound();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
};
