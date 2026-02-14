import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginPage.css'; // Reutilizamos los estilos del login

interface ResetPasswordFormData {
  nuevaPassword: string;
  confirmarNuevaPassword: string;
}

interface ValidationErrors {
  nuevaPassword?: string;
  confirmarNuevaPassword?: string;
}

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    nuevaPassword: '',
    confirmarNuevaPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Validar que el token exista al cargar la página
  useEffect(() => {
    if (!token) {
      setErrorMessage('Token de recuperación no válido. Por favor, solicita un nuevo enlace.');
    }
  }, [token]);

  const validatePassword = (password: string): string | null => {
    // Validación: No puede estar vacío
    if (!password.trim()) {
      return 'La contraseña es obligatoria';
    }

    // Validación: Longitud entre 8 y 50 caracteres
    if (password.length < 8 || password.length > 50) {
      return 'La contraseña debe tener entre 8 y 50 caracteres';
    }

    // Validación: Debe contener al menos una mayúscula
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula';
    }

    // Validación: Debe contener al menos una minúscula
    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra minúscula';
    }

    // Validación: Debe contener al menos un número
    if (!/[0-9]/.test(password)) {
      return 'La contraseña debe contener al menos un número';
    }

    // Validación: Debe contener al menos un carácter especial
    if (!/[@#$%^&+=!]/.test(password)) {
      return 'La contraseña debe contener al menos un carácter especial (@#$%^&+=!)';
    }

    // Validación: No debe contener espacios en blanco
    if (/\s/.test(password)) {
      return 'La contraseña no puede contener espacios en blanco';
    }

    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validar nueva contraseña
    const passwordError = validatePassword(formData.nuevaPassword);
    if (passwordError) {
      newErrors.nuevaPassword = passwordError;
    }

    // Validar confirmación de contraseña
    if (!formData.confirmarNuevaPassword.trim()) {
      newErrors.confirmarNuevaPassword = 'Debes confirmar tu contraseña';
    } else if (formData.nuevaPassword !== formData.confirmarNuevaPassword) {
      newErrors.confirmarNuevaPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores cuando el usuario empieza a escribir
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrorMessage('Token no válido. Por favor, solicita un nuevo enlace de recuperación.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('http://localhost:8080/api/credenciales/recuperar-password/reestablecer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          nuevaPassword: formData.nuevaPassword,
          confirmarNuevaPassword: formData.confirmarNuevaPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.mensaje || 'Error al restablecer la contraseña');
      }

      setSuccessMessage(data.mensaje || '¡Contraseña restablecida exitosamente!');
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  // Requisitos de contraseña para mostrar al usuario
  const passwordRequirements = [
    { text: 'Entre 8 y 50 caracteres', met: formData.nuevaPassword.length >= 8 && formData.nuevaPassword.length <= 50 },
    { text: 'Al menos una letra mayúscula', met: /[A-Z]/.test(formData.nuevaPassword) },
    { text: 'Al menos una letra minúscula', met: /[a-z]/.test(formData.nuevaPassword) },
    { text: 'Al menos un número', met: /[0-9]/.test(formData.nuevaPassword) },
    { text: 'Al menos un carácter especial (@#$%^&+=!)', met: /[@#$%^&+=!]/.test(formData.nuevaPassword) },
    { text: 'Sin espacios en blanco', met: !/\s/.test(formData.nuevaPassword) && formData.nuevaPassword.length > 0 }
  ];

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Restablecer Contraseña</h1>
        <p className="login-subtitle">Ingresa tu nueva contraseña</p>

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

        {!token && (
          <div className="alert alert-error">
            Token no válido. Por favor, solicita un nuevo enlace de recuperación.
          </div>
        )}

        {token && !successMessage && (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="nuevaPassword" className="input-label">
                Nueva Contraseña
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="nuevaPassword"
                  name="nuevaPassword"
                  value={formData.nuevaPassword}
                  onChange={handleInputChange}
                  className={`input-field ${errors.nuevaPassword ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  disabled={loading}
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    color: '#666',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.nuevaPassword && (
                <span className="error-message">{errors.nuevaPassword}</span>
              )}
            </div>

            {/* Mostrar requisitos de contraseña */}
            {formData.nuevaPassword && (
              <div style={{ 
                padding: '12px', 
                background: '#f8f9fa', 
                borderRadius: '6px', 
                fontSize: '12px',
                marginTop: '-8px'
              }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#333' }}>
                  Requisitos de la contraseña:
                </p>
                {passwordRequirements.map((req, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      color: req.met ? '#28a745' : '#6c757d',
                      marginBottom: '4px'
                    }}
                  >
                    <span>{req.met ? '✓' : '○'}</span>
                    <span>{req.text}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="input-group">
              <label htmlFor="confirmarNuevaPassword" className="input-label">
                Confirmar Nueva Contraseña
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmarNuevaPassword"
                  name="confirmarNuevaPassword"
                  value={formData.confirmarNuevaPassword}
                  onChange={handleInputChange}
                  className={`input-field ${errors.confirmarNuevaPassword ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  disabled={loading}
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    color: '#666',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmarNuevaPassword && (
                <span className="error-message">{errors.confirmarNuevaPassword}</span>
              )}
            </div>

            <button
              type="submit"
              className={`login-button ${loading ? 'button-disabled' : ''}`}
              disabled={loading || !token}
            >
              {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </button>
          </form>
        )}

        <div className="forgot-container">
          <button 
            className="forgot-link" 
            onClick={() => navigate('/login')} 
            disabled={loading}
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;