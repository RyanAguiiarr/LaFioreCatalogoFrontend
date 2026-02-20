import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/client';
import Button from '../../components/Button/Button';
import { ArrowLeft, Plus, Trash2, Upload } from 'lucide-react';
import './JewelryForm.css';

interface VariantForm {
  id?: string;
  dimensao: string;
  estoque: number;
  preco_variante?: string;
}

const JewelryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Product State
  const [nome, setNome] = useState('');
  const [sku, setSku] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('ANEL');
  const [preco, setPreco] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [imagensUrl, setImagensUrl] = useState<string[]>([]);

  // Variants State
  const [variants, setVariants] = useState<VariantForm[]>([]);

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    // Fetch Joia
    const { data: joia, error } = await supabase.from('joias').select('*').eq('id', id).single();
    if (joia) {
      setNome(joia.nome);
      setSku(joia.sku);
      setDescricao(joia.descricao || '');
      setCategoria(joia.categoria);
      setPreco(joia.preco.toString());
      setAtivo(joia.ativo);
      setImagensUrl(joia.imagens_url || []);
      
      // Fetch Variantes
      const { data: variantes } = await supabase.from('variantes').select('*').eq('joia_id', id);
      if (variantes) {
        setVariants(variantes.map((v: any) => ({ 
          id: v.id, 
          dimensao: v.dimensao, 
          estoque: v.estoque,
          preco_variante: v.preco_variante ? v.preco_variante.toString() : ''
        })));
      }
    } else {
      console.error(error);
    }
    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error } = await supabase.storage
        .from('produtos')
        .upload(filePath, file);

      if (error) {
        alert('Erro ao fazer upload da imagem. O bucket "produtos" existe e está público? Detalhes: ' + error.message);
      } else {
        const { data: publicUrlData } = supabase.storage.from('produtos').getPublicUrl(filePath);
        if (publicUrlData) {
          setImagensUrl([...imagensUrl, publicUrlData.publicUrl]);
        }
      }
    } catch (error: any) {
      alert('Erro inesperado: ' + error.message);
    } finally {
      setUploadingImage(false);
      // Reset input value so same file can be selected again
      event.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    // Ideally we would also delete the file from Supabase Storage here
    // but for simplicity we only remove the reference from the array
    setImagensUrl(imagensUrl.filter((_, index) => index !== indexToRemove));
  };

  const handleAddVariant = () => {
    setVariants([...variants, { dimensao: '', estoque: 0, preco_variante: '' }]);
  };

  const handleVariantChange = (index: number, field: keyof VariantForm, value: string | number) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setVariants(updatedVariants);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const joiaData = {
      nome,
      sku,
      descricao,
      categoria,
      preco: parseFloat(preco) || 0,
      ativo,
      imagens_url: imagensUrl
    };

    let joiaId = id;

    if (isEditing) {
      const { error } = await supabase.from('joias').update(joiaData).eq('id', id);
      if (error) { alert('Erro ao atualizar: ' + error.message); setLoading(false); return; }
    } else {
      const { data, error } = await supabase.from('joias').insert([joiaData]).select();
      if (error) { alert('Erro ao criar: ' + error.message); setLoading(false); return; }
      if (data && data.length > 0) joiaId = data[0].id;
    }

    if (joiaId) {
      if (isEditing) {
        await supabase.from('variantes').delete().eq('joia_id', joiaId);
      }
      
      if (variants.length > 0) {
        const variantsData = variants.map(v => ({
          joia_id: joiaId,
          dimensao: v.dimensao,
          estoque: Number(v.estoque),
          preco_variante: v.preco_variante && v.preco_variante.trim() !== '' ? parseFloat(v.preco_variante) : null
        }));
        await supabase.from('variantes').insert(variantsData);
      }
    }

    setLoading(false);
    navigate('/admin/dashboard');
  };

  if (loading && isEditing && nome === '') return <div className="container" style={{paddingTop:'150px'}}>Carregando...</div>;

  return (
    <div className="jewelry-form-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
          <ArrowLeft size={18} /> Voltar ao Painel
        </button>

        <div className="form-header">
          <h1>{isEditing ? 'Editar Joia' : 'Nova Joia'}</h1>
          <p>Preencha os detalhes do produto e faça upload das imagens para exibição no catálogo.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-sections">
            {/* Basic Info */}
            <section className="form-section">
              <h2>Informações Básicas</h2>
              <div className="form-row">
                <div className="input-group">
                  <label>Nome do Produto</label>
                  <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>SKU (Código Único)</label>
                  <input type="text" value={sku} onChange={e => setSku(e.target.value)} required disabled={isEditing} />
                </div>
              </div>
              
              <div className="form-row">
                <div className="input-group">
                  <label>Categoria</label>
                  <select value={categoria} onChange={e => setCategoria(e.target.value)} required>
                    <option value="ANEL">Anel</option>
                    <option value="COLAR">Colar</option>
                    <option value="PULSEIRA">Pulseira</option>
                    <option value="BRINCO">Brinco</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Preço Base (R$)</label>
                  <input type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} required />
                </div>
              </div>

              <div className="input-group">
                <label>Descrição</label>
                <textarea rows={4} value={descricao} onChange={e => setDescricao(e.target.value)} />
              </div>

              <div className="checkbox-group">
                <input type="checkbox" id="ativo" checked={ativo} onChange={e => setAtivo(e.target.checked)} />
                <label htmlFor="ativo">Exibir publicamente no catálogo</label>
              </div>
            </section>

            {/* Images Array */}
            <section className="form-section">
              <h2>Imagens do Produto</h2>
              <p className="section-note">Faça o upload de arquivos de imagem diretamente para o sistema.</p>
              
              <div className="file-upload-wrapper">
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  onChange={handleFileUpload} 
                  id="imageUpload"
                  disabled={uploadingImage}
                />
                <label htmlFor="imageUpload" className={`upload-btn ${uploadingImage ? 'uploading' : ''}`}>
                  <Upload size={18} /> {uploadingImage ? 'Enviando...' : 'Selecionar Imagem do Computador'}
                </label>
              </div>
              
              <div className="image-preview-list">
                {imagensUrl.length === 0 && !uploadingImage && (
                  <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', fontStyle: 'italic' }}>Nenhuma imagem adicionada.</p>
                )}
                {imagensUrl.map((url, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={url} alt={`Preview ${index}`} />
                    <button type="button" className="remove-image-btn" onClick={() => handleRemoveImage(index)} title="Remover imagem">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Variants */}
            <section className="form-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2>Variantes (Tamanhos/Aros)</h2>
                <button type="button" className="add-btn" onClick={handleAddVariant}><Plus size={16} /> Adicionar Variante</button>
              </div>
              
              {variants.length === 0 ? (
                <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Nenhuma variante adicionada. O produto será vendido com tamanho único.</p>
              ) : (
                <div className="variants-list">
                  {variants.map((variant, index) => (
                    <div key={index} className="variant-row">
                      <div className="input-group">
                        <label>Dimensão (Aro/Tam)</label>
                        <input 
                          type="text" 
                          value={variant.dimensao} 
                          placeholder="Ex: Aro 15"
                          onChange={e => handleVariantChange(index, 'dimensao', e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="input-group">
                        <label>Estoque</label>
                        <input 
                          type="number" 
                          min="0"
                          value={variant.estoque} 
                          onChange={e => handleVariantChange(index, 'estoque', e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="input-group">
                        <label>Preço Específico (R$)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="Deixe em branco p/ usar o base"
                          value={variant.preco_variante || ''} 
                          onChange={e => handleVariantChange(index, 'preco_variante', e.target.value)} 
                        />
                      </div>
                      <button type="button" className="remove-variant-btn" onClick={() => handleRemoveVariant(index)} title="Remover variante">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={loading || uploadingImage}>
              {loading ? 'Salvando...' : 'Salvar Joia'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JewelryForm;
