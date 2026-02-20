import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { Edit, Trash2, Plus } from 'lucide-react';
import Button from '../../components/Button/Button';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('joias')
      .select('id, nome, sku, categoria, preco, ativo')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta joia? Isso deletará todas as variantes também.')) {
      const { error } = await supabase.from('joias').delete().eq('id', id);
      if (error) {
        alert('Erro ao excluir: ' + error.message);
      } else {
        fetchProducts(); // Refresh list
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-header container">
        <div className="header-titles">
          <h1>Painel Administrativo</h1>
          <p>Gerenciamento do Catálogo de Joias</p>
        </div>
        <div className="header-actions">
           <Button variant="outline" onClick={handleLogout}>Sair</Button>
           <Button variant="primary" onClick={() => navigate('/admin/jewelry/new')}>
             <Plus size={18} style={{ marginRight: '8px' }}/> Nova Joia
           </Button>
        </div>
      </div>

      <div className="admin-content container">
        {loading ? (
          <p>Carregando dados...</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Nome da Joia</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center' }}>Nenhuma joia cadastrada.</td></tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td className="cell-sku">{product.sku}</td>
                      <td className="cell-name">{product.nome}</td>
                      <td>{product.categoria}</td>
                      <td className="cell-price">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco)}
                      </td>
                      <td>
                        <span className={`status-badge ${product.ativo ? 'status-active' : 'status-inactive'}`}>
                          {product.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="cell-actions">
                        <button 
                          className="action-btn edit-btn" 
                          onClick={() => navigate(`/admin/jewelry/edit/${product.id}`)}
                          aria-label="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          className="action-btn delete-btn" 
                          onClick={() => handleDelete(product.id)}
                          aria-label="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
