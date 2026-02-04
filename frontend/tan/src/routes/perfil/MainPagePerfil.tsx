import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';
import { useUserContext } from '../../context/UserContext';
import authService from '../../services/authService';
import { setTokens, clearTokens } from '../../utils/auth';
import { ROLE_DESCRIPTIONS } from '../../constants/roles';
import './MainPagePerfil.css';

const MainPagePerfil: React.FC = () => {
  const { user, refresh } = useUserContext();
  const [activeTab, setActiveTab] = useState<'password' | 'email'>('password');

  // Password visibility toggles
  const [showPasswordActual, setShowPasswordActual] = useState(false);
  const [showNuevaPassword, setShowNuevaPassword] = useState(false);
  const [showConfirmarPassword, setShowConfirmarPassword] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    passwordActual: '',
    nuevaPassword: '',
    confirmarNuevaPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Email change state
  const [emailData, setEmailData] = useState({
    nuevoEmail: '',
    passwordActual: ''
  });
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  // Limpiar mensajes de éxito después de 6 segundos
  useEffect(() => {
    if (passwordSuccess) {
      const timer = setTimeout(() => setPasswordSuccess(''), 6000);
      return () => clearTimeout(timer);
    }
  }, [passwordSuccess]);

  useEffect(() => {
    if (emailSuccess) {
      const timer = setTimeout(() => setEmailSuccess(''), 6000);
      return () => clearTimeout(timer);
    }
  }, [emailSuccess]);

  // Validación de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 100;
  };

  // Validación de contraseña
  const validatePasswordChange = (): boolean => {
    if (!passwordData.passwordActual.trim()) {
      setPasswordError('La contraseña actual es obligatoria');
      return false;
    }

    if (!passwordData.nuevaPassword.trim()) {
      setPasswordError('La nueva contraseña es obligatoria');
      return false;
    }

    if (!passwordData.confirmarNuevaPassword.trim()) {
      setPasswordError('Debe confirmar la nueva contraseña');
      return false;
    }

    if (passwordData.nuevaPassword !== passwordData.confirmarNuevaPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden');
      return false;
    }

    if (passwordData.passwordActual === passwordData.nuevaPassword) {
      setPasswordError('La nueva contraseña debe ser distinta a la actual');
      return false;
    }

    return true;
  };

  // Validación de email
  const validateEmailChange = (): boolean => {
    if (!emailData.nuevoEmail.trim()) {
      setEmailError('El email es obligatorio');
      return false;
    }

    if (!isValidEmail(emailData.nuevoEmail)) {
      setEmailError('El formato del email no es válido');
      return false;
    }

    if (emailData.nuevoEmail.length > 100) {
      setEmailError('El email no puede exceder los 100 caracteres');
      return false;
    }

    if (!emailData.passwordActual.trim()) {
      setEmailError('La contraseña actual es obligatoria');
      return false;
    }

    return true;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validar antes de enviar
    if (!validatePasswordChange()) {
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await authService.changePassword(
        passwordData.passwordActual,
        passwordData.nuevaPassword,
        passwordData.confirmarNuevaPassword
      );

      // Limpiar tokens antiguos y guardar los nuevos
      clearTokens();
      setTokens(response.tokens.access_token, response.tokens.refresh_token, true);
      await refresh();
      
      // Mostrar éxito y limpiar campos
      setPasswordData({ passwordActual: '', nuevaPassword: '', confirmarNuevaPassword: '' });
      setPasswordSuccess('Las credenciales fueron cambiadas con éxito');
    } catch (error: any) {
      // Intentar extraer el mensaje del JSON de error
      try {
        const errorData = JSON.parse(error.message);
        setPasswordError(errorData.message || error.message);
      } catch {
        setPasswordError(error.message);
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');

    // Validar antes de enviar
    if (!validateEmailChange()) {
      return;
    }

    setEmailLoading(true);

    try {
      const response = await authService.changeEmail(
        emailData.nuevoEmail,
        emailData.passwordActual
      );

      // Limpiar tokens antiguos y guardar los nuevos
      clearTokens();
      setTokens(response.tokens.access_token, response.tokens.refresh_token, true);
      await refresh();
      
      // Mostrar éxito y limpiar campos
      setEmailData({ nuevoEmail: '', passwordActual: '' });
      setEmailSuccess('Las credenciales fueron cambiadas con éxito');
    } catch (error: any) {
      // Intentar extraer el mensaje del JSON de error
      try {
        const errorData = JSON.parse(error.message);
        setEmailError(errorData.message || error.message);
      } catch {
        setEmailError(error.message);
      }
    } finally {
      setEmailLoading(false);
    }
  };

  if (!user) {
    return <div className="perfil-container">Cargando...</div>;
  }

  return (
    <div className="perfil-container">
      <h1 className="perfil-title">Mi Perfil</h1>
      <p className="perfil-subtitle">Información de su cuenta</p>

      {/* Personal Information Card */}
      <div className="perfil-card">
        <div className="card-header">
          <h2 className="card-title">Información Personal</h2>
          <p className="card-subtitle">Información de su cuenta</p>
        </div>

        <div className="personal-info-content">
          <div className="avatar-container">
            <div className="avatar">👤</div>
          </div>

          <div className="info-fields">
            <div className="info-field">
              <label className="field-label">Nombre completo</label>
              <div className="field-value">{user.nombre}</div>
            </div>

            <div className="info-field">
              <label className="field-label">Correo electrónico</label>
              <div className="field-value">{user.email}</div>
            </div>

            <div className="roles-section">
              <label className="roles-label">Roles</label>
              <div className="roles-container">
                {user.roles.map((role) => (
                  <span key={role} className="role-badge">
                    {ROLE_DESCRIPTIONS[role] || role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credentials Change Card */}
      <div className="perfil-card">
        {/* Tab Navigation */}
        <div className="credentials-tabs">
          <button
            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Cambiar Contraseña
          </button>
          <button
            className={`tab-button ${activeTab === 'email' ? 'active' : ''}`}
            onClick={() => setActiveTab('email')}
          >
            Cambiar Email
          </button>
        </div>

        {/* Password Change Form */}
        <div className={`form-section ${activeTab === 'password' ? 'active' : ''}`}>
          <div className="card-header">
            <h2 className="card-title">Cambiar Contraseña</h2>
            <p className="card-subtitle">Actualice su contraseña de acceso</p>
          </div>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label">Contraseña actual</label>
              <div className="input-wrapper">
                <input
                  type={showPasswordActual ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Ingrese su contraseña actual"
                  value={passwordData.passwordActual}
                  onChange={(e) => setPasswordData({ ...passwordData, passwordActual: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPasswordActual(!showPasswordActual)}
                  tabIndex={-1}
                >
                  {showPasswordActual ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Nueva contraseña</label>
              <div className="input-wrapper">
                <input
                  type={showNuevaPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Ingrese su nueva contraseña"
                  value={passwordData.nuevaPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, nuevaPassword: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNuevaPassword(!showNuevaPassword)}
                  tabIndex={-1}
                >
                  {showNuevaPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar nueva contraseña</label>
              <div className="input-wrapper">
                <input
                  type={showConfirmarPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Confirme su nueva contraseña"
                  value={passwordData.confirmarNuevaPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmarNuevaPassword: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmarPassword(!showConfirmarPassword)}
                  tabIndex={-1}
                >
                  {showConfirmarPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button type="submit" className="form-submit" disabled={passwordLoading}>
              {passwordLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </button>
          </form>
          {passwordError && <div className="message message-error">{passwordError}</div>}
          {passwordSuccess && (
            <div className="message message-success">
              <FaCheck style={{ marginRight: '8px' }} />
              {passwordSuccess}
            </div>
          )}
        </div>

        {/* Email Change Form */}
        <div className={`form-section ${activeTab === 'email' ? 'active' : ''}`}>
          <div className="card-header">
            <h2 className="card-title">Cambiar Email</h2>
            <p className="card-subtitle">Actualice su correo electrónico de acceso</p>
          </div>
          <form onSubmit={handleEmailChange}>
            <div className="form-group">
              <label className="form-label">Nuevo correo electrónico</label>
              <input
                type="email"
                className="form-input"
                placeholder="nuevo@ejemplo.com"
                value={emailData.nuevoEmail}
                onChange={(e) => setEmailData({ ...emailData, nuevoEmail: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña actual</label>
              <div className="input-wrapper">
                <input
                  type={showEmailPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Ingrese su contraseña actual"
                  value={emailData.passwordActual}
                  onChange={(e) => setEmailData({ ...emailData, passwordActual: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowEmailPassword(!showEmailPassword)}
                  tabIndex={-1}
                >
                  {showEmailPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button type="submit" className="form-submit" disabled={emailLoading}>
              {emailLoading ? 'Actualizando...' : 'Actualizar Email'}
            </button>
          </form>
          {emailError && <div className="message message-error">{emailError}</div>}
          {emailSuccess && (
            <div className="message message-success">
              <FaCheck style={{ marginRight: '8px' }} />
              {emailSuccess}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPagePerfil;
