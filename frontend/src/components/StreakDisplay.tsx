interface StreakDisplayProps {
  count: number;
}

export function StreakDisplay({ count }: StreakDisplayProps) {
  return (
    <div
      title={`Current streak: ${count}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <path
          d="M12 2C12 2 7 8 7 13C7 16.87 9.24 19 12 19C14.76 19 17 16.87 17 13C17 8 12 2 12 2Z"
          fill={count > 0 ? '#e8943a' : 'var(--color-muted)'}
          opacity={count > 0 ? 1 : 0.5}
        />
        <path
          d="M12 19C10.5 19 9.5 17.5 9.5 15.5C9.5 13.5 12 10 12 10C12 10 14.5 13.5 14.5 15.5C14.5 17.5 13.5 19 12 19Z"
          fill={count > 0 ? '#f5c842' : 'var(--color-muted)'}
          opacity={count > 0 ? 1 : 0.4}
        />
      </svg>
      <span
        className="font-cinzel"
        style={{
          fontSize: '0.78rem',
          fontWeight: 700,
          color: count > 0 ? '#e8943a' : 'var(--color-muted)',
          letterSpacing: '0.04em',
          minWidth: '14px',
        }}
      >
        {count}
      </span>
    </div>
  );
}
