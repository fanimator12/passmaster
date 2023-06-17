import { ChangeEvent } from "react";

export interface AppHeaderProps {
  sections: ReadonlyArray<{
    title: string;
    url: string;
  }>;
  title: string;
}

export interface NavLinkProps {
  title: string;
  url: string;
}

export interface HeaderProps {
  handleDrawerToggle: () => void;
  mobileOpen: boolean;
}

export interface NavDrawerProps {
  handleDrawerToggle: () => void;
  mobileOpen: boolean;
}

export interface LoginBackgroundProps {
  background: any;
  slogan: string;
}

export interface ParallaxBackgroundProps {
  background: any;
  title?: string;
}

export interface CheckboxLabelProps {
  labelText?: string | any;
  link?: string;
  checked: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface DashboardNavBarProps {
  onDrawerToggle: () => void;
}
