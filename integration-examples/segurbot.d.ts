// src/types/segurbot.d.ts

declare global {
  interface Window {
    SegurBotWidget: SegurBotWidgetConstructor;
  }
}

export interface SegurBotConfig {
  apiUrl: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  initialMessage?: string;
  title?: string;
  autoOpen?: boolean;
  width?: string;
  height?: string;
  enableDebug?: boolean;
  containerId?: string;
}

export interface SegurBotWidget {
  init(): void;
  open(): void;
  close(): void;
  toggle(): void;
  destroy(): void;
  updateConfig(config: Partial<SegurBotConfig>): void;
}

export interface SegurBotWidgetConstructor {
  new (config: SegurBotConfig): SegurBotWidget;
}

export interface UseSegurBotReturn {
  isLoaded: boolean;
  isOpen: boolean;
  error: string | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  updateConfig: (config: Partial<SegurBotConfig>) => void;
  widget: SegurBotWidget | null;
}

export interface SegurBotWidgetProps {
  apiUrl?: string;
  position?: SegurBotConfig['position'];
  initialMessage?: string;
  title?: string;
  autoOpen?: boolean;
  width?: string;
  height?: string;
  enableDebug?: boolean;
  showButton?: boolean;
  buttonText?: string;
  className?: string;
  children?: (props: UseSegurBotReturn) => React.ReactNode;
}
