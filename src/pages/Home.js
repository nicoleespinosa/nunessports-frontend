import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';
import './Home.css';
import './Modal.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  // Estado para armazenar a lista de produtos
  const [products, setProducts] = useState([]);
  
  // Estado para armazenar o termo de pesquisa
  const [searchTerm, setSearchTerm] = useState('');

  // Estados e funções para o modal de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);

  // Estados e funções para o modal de adição de produto
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    code: '',
    name: '',
    description: '',
    price: '',
  });

  // Estados e funções para o modal de edição de produto
  const [showEditProductModal, setShowEditProductModal] = useState(false); 
  const [editProductId, setEditProductId] = useState(null); 
  const [editedProduct, setEditedProduct] = useState({
    code: '',
    name: '',
    description: '',
    price: '',
  });

  // Efeito para carregar os produtos ao montar o componente
  useEffect(() => {
    loadProducts();
  }, []);

  // Função para carregar os produtos da API
  const loadProducts = async () => {
    const result = await axios.get('http://localhost:8080/products');
    setProducts(result.data);
  };

  // Função para deletar um produto
  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:8080/product/${id}`);
    loadProducts();
    closeDeleteModal();
  };

  // Função para abrir o modal de exclusão
  const openDeleteModal = (productId) => {
    setDeleteProductId(productId);
    setShowDeleteModal(true);
  };

  // Função para fechar o modal de exclusão
  const closeDeleteModal = () => {
    setDeleteProductId(null);
    setShowDeleteModal(false);
  };

  // Função para lidar com a mudança no campo de pesquisa
  const handleSearchChange = (event) => {
    const value = event.target.value || '';
    setSearchTerm(value.toLowerCase());
  };

  // Filtrar produtos com base no termo de pesquisa
  const filteredProducts = products.filter((product) =>
    (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.code && product.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.id && String(product.id).includes(searchTerm))
  );

  // Função para abrir o modal de adição de produto
  const openAddProductModal = () => {
    setShowAddProductModal(true);
  };

  // Função para fechar o modal de adição de produto
  const closeAddProductModal = () => {
    setShowAddProductModal(false);
  };

  // Função para lidar com o envio do formulário de adição de produto
  const onSubmitAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/product', newProduct);
      await loadProducts(); 
      closeAddProductModal(); 
      setNewProduct({
        code: '',
        name: '',
        description: '',
        price: '',
      });
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  // Função para lidar com a mudança nos campos do formulário de adição de produto
  const onNewProductInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };  

  // Função para abrir o modal de edição de produto
  const openEditProductModal = (productId) => {
    setEditProductId(productId);
    setShowEditProductModal(true);
    const productToEdit = products.find((product) => product.id === productId);
    if (productToEdit) {
      setEditedProduct(productToEdit);
    }
  };

  // Função para fechar o modal de edição de produto
  const closeEditProductModal = () => {
    setEditProductId(null);
    setShowEditProductModal(false);
    setEditedProduct({
      code: '',
      name: '',
      description: '',
      price: '',
    });
  };

  // Função para lidar com o envio do formulário de edição de produto
  const onSubmitEditProduct = async (e) => {
    e.preventDefault();
    try {
      const editedProductId = parseInt(editProductId, 10);
      await axios.put(`http://localhost:8080/product/${editedProductId}`, editedProduct);
      loadProducts();
      closeEditProductModal();
    } catch (error) {
      console.error('Erro ao editar o produto:', error);
    }
  };

  // Função para lidar com a mudança nos campos do formulário de edição de produto
  const onEditProductInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  return (
    <div className='container-fluid'>
      <div className='py-5'>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <div>
            {/* Botão para abrir o modal de adição de produto */}
            <Button className='btn btn-new-product' onClick={openAddProductModal}>
              <FontAwesomeIcon icon={faPlus} className='me-2' />
              Novo
            </Button>
          </div>
          <div className='d-flex'>
            <div className='input-group'>
              {/* Campo de pesquisa */}
              <span className='input-group-text'>
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type='text'
                className='form-control me-2'
                placeholder='Pesquisar por produto'
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        {/* Tabela de produtos */}
        <table className='table align-middle table-bordered'>
          <thead>
            <tr>
              <th scope='col'>ID</th>
              <th scope='col'>Código</th>
              <th scope='col'>Nome</th>
              <th scope='col'>Descrição</th>
              <th scope='col'>Preço</th>
              <th scope='col'>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={index}>
                <th scope='row'>{product.id}</th>
                <td>{product.code}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    {/* Botões de ação para editar e deletar */}
                    <Button
                      className='btn btn-success btn-table-action'
                      onClick={() => openEditProductModal(product.id)}>
                        <FontAwesomeIcon icon={faEdit} className='me-2' />
                        Editar
                    </Button>
                    <Button
                      className='btn btn-danger btn-table-action'
                      onClick={() => openDeleteModal(product.id)}>
                        <FontAwesomeIcon icon={faTrash} className='me-2'/>
                        Deletar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal para adicionar produto */}
        <Modal show={showAddProductModal} onHide={closeAddProductModal}>
          <Modal.Header>
            <Modal.Title>Adicionar produto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Formulário para adicionar produto */}
            <form onSubmit={(e) => onSubmitAddProduct(e)}>
              {/* Campos do formulário */}
              <div className='mb-3 form-floating'>
                <input
                  type='text'
                  className='form-control'
                  id='code'
                  placeholder='Código do produto'
                  name='code'
                  value={newProduct.code}
                  onChange={(e) => onNewProductInputChange(e)}
                />
                <label htmlFor='code'>Código</label>
              </div>
              <div className='mb-3 form-floating'>
                <input
                  type='text'
                  className='form-control'
                  id='name'
                  placeholder='Nome do produto'
                  name='name'
                  value={newProduct.name}
                  onChange={(e) => onNewProductInputChange(e)}
                />
                <label htmlFor='name'>Nome do Produto</label>
              </div>
              <div className='mb-3 form-floating'>
                <input
                  type='text'
                  className='form-control'
                  id='description'
                  placeholder='Descrição do produto'
                  name='description'
                  value={newProduct.description}
                  onChange={(e) => onNewProductInputChange(e)}
                />
                <label htmlFor='description' className='form-label'>Descrição</label>
              </div>
              <div className='mb-3 form-floating'>
                <input
                  type='text'
                  className='form-control'
                  id='price'
                  placeholder='Preço do produto'
                  name='price'
                  value={newProduct.price}
                  onChange={(e) => onNewProductInputChange(e)}
                />
                <label htmlFor='price'>Preço</label>
              </div>
              {/* Botões de ação no final do formulário */}
              <div className='d-flex justify-content-between btn-group-form'>
                <Button variant='secondary' className='btn-cancel' onClick={closeAddProductModal}>
                  Cancelar
                </Button>
                <Button type='submit' className='btn-confirm' variant='primary'>
                  Confirmar
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>

        {/* Modal para editar produto */}
        <Modal show={showEditProductModal} onHide={closeEditProductModal}>
          <Modal.Header>
            <Modal.Title>Editar produto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Formulário para editar produto */}
            <form onSubmit={(e) => onSubmitEditProduct(e)}>
              {/* Campos do formulário */}
              <div className='mb-3 form-floating'>
                <input
                  type='text'
                  className='form-control'
                  id='editCode'
                  placeholder='Código do produto'
                  name='code'
                  value={editedProduct.code}
                  onChange={(e) => onEditProductInputChange(e)}
                />
                <label htmlFor='editCode'>Código</label>
              </div>
              <div className='mb-3 form-floating'>
                <input
                  type='text'
                  className='form-control'
                  id='editName'
                  placeholder='Nome do produto'
                  name='name'
                  value={editedProduct.name}
                  onChange={(e) => onEditProductInputChange(e)}
                />
                <label htmlFor='editName'>Nome do Produto</label>
              </div>
              <div className='mb-3 form-floating'>
                <input
                  type='text'
                  className='form-control'
                  id='editDescription'
                  placeholder='Descrição do produto'
                  name='description'
                  value={editedProduct.description}
                  onChange={(e) => onEditProductInputChange(e)}
                />
                <label htmlFor='editDescription'>Descrição</label>
              </div>
              <div className='mb-3 form-floating'>
                <input
                  type='text'
                  className='form-control'
                  id='editPrice'
                  placeholder='Preço do produto'
                  name='price'
                  value={editedProduct.price}
                  onChange={(e) => onEditProductInputChange(e)}
                />
                <label className='form-label' htmlFor='editPrice'>Preço</label>
              </div>
              {/* Botões de ação no final do formulário */}
              <div className='d-flex justify-content- btn-group-form'>
                <Button variant='secondary' className='btn-cancel' onClick={closeEditProductModal}>
                  Cancelar
                </Button>
                <Button type='submit' variant='primary' className='btn-confirm'>
                  Confirmar
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>

        {/* Modal para confirmar exclusão */}
        <Modal show={showDeleteModal} onHide={closeDeleteModal}>
          <Modal.Header>
            <Modal.Title>Confirmar exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>Tem certeza que deseja deletar este produto?</Modal.Body>
          <Modal.Footer>
            {/* Botões de ação no final do modal */}
            <Button variant="secondary" className='btn-cancel' onClick={closeDeleteModal}>
              Cancelar
            </Button>
            <Button variant="danger" className='btn-confirm' onClick={() => deleteProduct(deleteProductId)}>
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
