import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/client';
import Button from '../../components/Button/Button';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate('/admin/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Acesso Restrito</h1>
        <p className="login-subtitle">Gerenciar Catálogo La Fiore</p>
        
        {errorMsg && <div className="login-error">{errorMsg}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email">E-mail Administrativo</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={loading}
              placeholder="admin@lafiore.com"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={loading}
              placeholder="••••••••"
            />
          </div>
          
          <Button type="submit" variant="primary" isFullWidth disabled={loading}>
            {loading ? 'Autenticando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
