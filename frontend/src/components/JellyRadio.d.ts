import { ReactNode } from 'react';

export interface JellyRadioItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export type JellyRadioItemProp = string | JellyRadioItem;

export interface JellyRadioProps {
  items?: JellyRadioItemProp[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, index: number) => void;
  chipColor?: string;
  activeColor?: string;
  textColor?: string;
  activeTextColor?: string;
  size?: 'sm' | 'md' | 'lg';
  gap?: number;
  radius?: number;
  swell?: number;
  barge?: number;
  shrink?: number;
  jelly?: number;
  bounce?: number;
  stagger?: number;
  stiffness?: number;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

export default function JellyRadio(props: JellyRadioProps): React.JSX.Element;
