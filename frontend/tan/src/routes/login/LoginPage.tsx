import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import { clearTokens } from '../../services/authService';
import './LoginPage.css';
import Modal from '../../generalComponents/Modal/Modal';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // Estado para modal de recuperación
  const [openRecuperar, setOpenRecuperar] = useState(false);
  const [recuperarTab, setRecuperarTab] = useState<'email' | 'password'>('email');

  // Estados para recuperar email
  const [dniRecuperar, setDniRecuperar] = useState('');
  const [tipoUsuarioRecuperar, setTipoUsuarioRecuperar] = useState<'EMPLEADO' | 'CLIENTE'>('EMPLEADO');
  const [recuperarEmailLoading, setRecuperarEmailLoading] = useState(false);
  const [recuperarEmailMensaje, setRecuperarEmailMensaje] = useState<string | null>(null);
  const [emailEncontrado, setEmailEncontrado] = useState<string | null>(null);

  // Estados para recuperar password
  const [emailRecuperar, setEmailRecuperar] = useState('');
  const [recuperarPasswordLoading, setRecuperarPasswordLoading] = useState(false);
  const [recuperarPasswordMensaje, setRecuperarPasswordMensaje] = useState<string | null>(null);
  const [recuperarPasswordSuccess, setRecuperarPasswordSuccess] = useState<boolean | null>(null);

  const userCtx = useUserContext();

  //* Verificar si ya existe una sesión activa y validar con el contexto de usuario
  useEffect(() => {
    const accessToken = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
    // Si no hay token, no redirigimos
    if (!accessToken) return;

    // Si ya tenemos user en contexto, redirigimos al root
    if (userCtx.user) {
      navigate('/');
      return;
    }

    // Token presente pero inválido: limpiar y quedarse en login
    if (!userCtx.loading && !userCtx.user) {
      clearTokens();
    }
  }, [navigate, userCtx.user, userCtx.loading]);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setErrorMessage(null);
  };

  const handleOpenRecuperar = (tab: 'email' | 'password') => {
    setRecuperarTab(tab);
    // reset mensajes
    setRecuperarEmailMensaje(null);
    setEmailEncontrado(null);
    setRecuperarPasswordMensaje(null);
    setOpenRecuperar(true);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          password: formData.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }

      const data: LoginResponse = await response.json();

      //* Guardar tokens según la preferencia del usuario
      if (rememberMe) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
      } else {
        sessionStorage.setItem('access_token', data.access_token);
        sessionStorage.setItem('refresh_token', data.refresh_token);
      }

      setSuccessMessage('¡Inicio de sesión exitoso! Obteniendo perfil...');

      // Refrescar contexto de usuario y usar el resultado devuelto para evitar condiciones de carrera
      try {
        const fetchedUser = await userCtx.refresh();
        if (fetchedUser) {
          setSuccessMessage('¡Inicio de sesión exitoso! Redirigiendo...');
          navigate('/');
        } else {
          // Si por alguna razón no se pudo obtener el usuario, limpiar tokens y mostrar error
          clearTokens();
          setSuccessMessage(null);
          setErrorMessage('No se pudo obtener información del usuario tras el login. Intenta de nuevo.');
        }
      } catch (err) {
        clearTokens();
        setSuccessMessage(null);
        setErrorMessage(err instanceof Error ? err.message : 'Error al obtener perfil');
      }

    } catch (error) {
      console.error('Error en login:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRecuperarEmail = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setRecuperarEmailMensaje(null);
    setEmailEncontrado(null);

    if (!dniRecuperar.trim()) {
      setRecuperarEmailMensaje('El DNI es obligatorio');
      return;
    }

    setRecuperarEmailLoading(true);
    try {
      const r = await fetch('http://localhost:8080/api/credenciales/recuperar-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni: dniRecuperar.trim(), tipoUsuario: tipoUsuarioRecuperar })
      });

      const body = await r.json().catch(() => ({}));
      if (!r.ok) {
        // mostrar mensaje tal cual lo envía el backend
        const msg = body.message || body.mensaje || JSON.stringify(body) || 'Error en el servidor';
        setRecuperarEmailMensaje(msg);
        return;
      }

      // respuesta esperada: { mensaje, emailEncontrado, exito }
      if (body.exito === false) {
        // Mostrar mensaje explícito cuando no hay email encontrado
        setRecuperarEmailMensaje('No existe un email para el usuario buscado.');
        setEmailEncontrado(null);
      } else {
        const encontrado = body.emailEncontrado || null;
        setRecuperarEmailMensaje((body.mensaje ? body.mensaje + (encontrado ? `: ${encontrado}` : '') : (encontrado ? `Email encontrado: ${encontrado}` : 'Email encontrado')));
        setEmailEncontrado(encontrado);
      }
    } catch (err) {
      setRecuperarEmailMensaje(err instanceof Error ? err.message : 'Error de red');
    } finally {
      setRecuperarEmailLoading(false);
    }
  }

  const handleRecuperarPassword = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setRecuperarPasswordMensaje(null);

    if (!emailRecuperar.trim()) {
      setRecuperarPasswordMensaje('El email es obligatorio');
      return;
    }

    if (!/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(emailRecuperar)) {
      setRecuperarPasswordMensaje('Email inválido');
      return;
    }

    setRecuperarPasswordLoading(true);
    try {
      const r = await fetch('http://localhost:8080/api/credenciales/recuperar-password/solicitar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailRecuperar.trim().toLowerCase() })
      });

      const body = await r.json().catch(() => ({}));
      if (!r.ok) {
        const msg = body.message || body.mensaje || JSON.stringify(body) || 'Error en el servidor';
        setRecuperarPasswordMensaje(msg);
        setRecuperarPasswordSuccess(false);
        return;
      }
      setRecuperarPasswordMensaje(body.mensaje || 'Si el email está registrado, recibirás un enlace de recuperación.');
      setRecuperarPasswordSuccess(true);
    } catch (err) {
      setRecuperarPasswordMensaje(err instanceof Error ? err.message : 'Error de red');
    } finally {
      setRecuperarPasswordLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Bienvenido</h1>
        <p className="login-subtitle">Inicia sesión para continuar</p>

        {errorMessage && (
          <div className="alert alert-error">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`input-field ${errors.email ? 'input-error' : ''}`}
              placeholder="tu@email.com"
              disabled={loading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`input-field ${errors.password ? 'input-error' : ''}`}
              placeholder="••••••••"
              disabled={loading}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="checkbox-container">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="checkbox-input"
              disabled={loading}
            />
            <label htmlFor="rememberMe" className="checkbox-label">
              Mantener sesión abierta entre pestañas
            </label>
          </div>

          <button
            type="submit"
            className={`login-button ${loading ? 'button-disabled' : ''}`}
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="forgot-container">
          <button className="forgot-link" onClick={() => handleOpenRecuperar('email')} disabled={loading}>Olvidé mis credenciales</button>
        </div>

        <Modal isOpen={openRecuperar} onClose={() => setOpenRecuperar(false)} title="Olvidé mis credenciales" showCloseButton>
          <div className="recuperar-tabs">
            <button className={`recuperar-tab ${recuperarTab === 'email' ? 'active' : ''}`} onClick={() => setRecuperarTab('email')}>Olvidé mi Email</button>
            <button className={`recuperar-tab ${recuperarTab === 'password' ? 'active' : ''}`} onClick={() => setRecuperarTab('password')}>Olvidé mi Contraseña</button>
          </div>

          {recuperarTab === 'email' && (
            <form onSubmit={handleRecuperarEmail} className="recuperar-form">
              <div className="input-group">
                <label className="input-label">DNI</label>
                <input className="input-field" value={dniRecuperar} onChange={(e) => setDniRecuperar(e.target.value)} disabled={recuperarEmailLoading} />
              </div>

              <div className="input-group">
                <label className="input-label">Tipo de usuario</label>
                <select className="input-field" value={tipoUsuarioRecuperar} onChange={(e) => setTipoUsuarioRecuperar(e.target.value as 'EMPLEADO' | 'CLIENTE')} disabled={recuperarEmailLoading}>
                  <option value="EMPLEADO">EMPLEADO</option>
                  <option value="CLIENTE">CLIENTE</option>
                </select>
              </div>

              {recuperarEmailMensaje && (
                <div className={`alert ${emailEncontrado ? 'alert-success' : 'alert-error'}`}>{recuperarEmailMensaje}</div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button className={`login-button ${recuperarEmailLoading ? 'button-disabled' : ''}`} type="submit" disabled={recuperarEmailLoading}>{recuperarEmailLoading ? 'Buscando...' : 'Buscar Email'}</button>
                <button className="login-button" type="button" onClick={() => { setDniRecuperar(''); setTipoUsuarioRecuperar('EMPLEADO'); setRecuperarEmailMensaje(null); setEmailEncontrado(null); }} disabled={recuperarEmailLoading}>Limpiar</button>
              </div>
            </form>
          )}

          {recuperarTab === 'password' && (
            <form onSubmit={handleRecuperarPassword} className="recuperar-form">
              <div className="input-group">
                <label className="input-label">Email</label>
                <input className="input-field" value={emailRecuperar} onChange={(e) => setEmailRecuperar(e.target.value)} disabled={recuperarPasswordLoading} />
              </div>

              {recuperarPasswordMensaje && (
                <div className={`alert ${recuperarPasswordSuccess ? 'alert-success' : 'alert-error'}`}>{recuperarPasswordMensaje}</div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button className={`login-button ${recuperarPasswordLoading ? 'button-disabled' : ''}`} type="submit" disabled={recuperarPasswordLoading}>{recuperarPasswordLoading ? 'Enviando...' : 'Solicitar recuperación'}</button>
                <button className="login-button" type="button" onClick={() => { setEmailRecuperar(''); setRecuperarPasswordMensaje(null); }} disabled={recuperarPasswordLoading}>Limpiar</button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default LoginPage;