import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente Navbar para a aplicação.
 * 
 * Exibe uma barra de navegação com um logotipo que direciona para a página inicial.
 */
const Navbar = () => {
  return (
    <div>
      {/* Barra de navegação */}
      <nav className='navbar navbar-expanded-lg'>
        <div className='container-fluid'>
          {/* Logotipo com link para a página inicial */}
          <Link className='navbar-brand' to={'/'}>
            <img src='/assets/logo_nunessports.svg' alt='Logo'/>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
