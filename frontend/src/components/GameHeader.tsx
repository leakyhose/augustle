import { AugustleLogo } from './AugustleLogo.tsx';

interface GameHeaderProps {
  onHome?: () => void;
  modeName?: string;
}

export function GameHeader({ onHome, modeName }: GameHeaderProps) {
  return (
    <header
      style={{
        width: '100%',
        padding: '0.4rem 0 0.2rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AugustleLogo size="small" modeName={modeName} onClick={onHome} />
    </header>
  );
}
