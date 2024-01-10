// Importações dos componentes e bibliotecas
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from './layout/Navbar';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Função principal do componente App
function App() {
  return (
    // Elemento principal da aplicação
    <div className="App">
      {/* Configuração do roteador usando BrowserRouter */}
      <Router>
        {/* Inclusão do componente Navbar na estrutura da aplicação */}
        <Navbar />
        {/* Definição das rotas usando o componente Routes */}
        <Routes>
          {/* Rota padrão que renderiza o componente Home */}
          <Route exact path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;