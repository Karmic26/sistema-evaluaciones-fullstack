interface LoadingProps {
  message?: string;
}

export function Loading({ message = 'Cargando...' }: LoadingProps) {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <span style={{ marginLeft: '1rem' }}>{message}</span>
    </div>
  );
}