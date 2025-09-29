import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();

  return (
    <header style={headerStyle}>
      <div className="container">
        <nav style={navStyle}>
          <Link to="/" style={logoStyle}>
            📚 Sistema de Evaluaciones
          </Link>
          
          <div style={navLinksStyle}>
            <Link 
              to="/" 
              style={{
                ...navLinkStyle,
                ...(location.pathname === '/' ? activeLinkStyle : {})
              }}
            >
              Inicio
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

const headerStyle = {
  backgroundColor: 'var(--bg-primary)',
  borderBottom: '1px solid var(--border-color)',
  boxShadow: 'var(--shadow)',
  position: 'sticky' as const,
  top: 0,
  zIndex: 100,
};

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem 0',
};

const logoStyle = {
  fontSize: '1.5rem',
  fontWeight: '700',
  color: 'var(--primary-color)',
  textDecoration: 'none',
  transition: 'var(--transition)',
};

const navLinksStyle = {
  display: 'flex',
  gap: '2rem',
};

const navLinkStyle = {
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  fontWeight: '500',
  padding: '0.5rem 1rem',
  borderRadius: 'var(--border-radius)',
  transition: 'var(--transition)',
};

const activeLinkStyle = {
  color: 'var(--primary-color)',
  backgroundColor: 'var(--bg-secondary)',
};