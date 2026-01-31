import React, { useState, useEffect } from 'react';
import './ModalAltaEntidad.css';

interface Cliente {
  id: number;
  codCliente: string;
  nombreCliente: string;
  dniCliente: string;
  fechaHoraAltaCliente: string;
  codigosInmuebles: string[];
  nombresInmuebles: string[];
  cantidadInmuebles: number;
  activo: boolean;
}

interface ModalModificarClienteProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente | null;
  onSuccess: () => void;
  onConfirm: (id: number, data: any) => Promise<any>;
}

interface FormData {
  dniCliente: string;
  nombreCliente: string;
}

interface ModificacionResponse {
  mensaje: string;
  exito: boolean;
  codCliente: string;
  nombreCliente: string;
  dniCliente: string;
}

const ModalModificarCliente: React.FC<ModalModificarClienteProps> = ({
  isOpen,
  onClose,
  cliente,
  onSuccess,
  onConfirm,
}) => {
  const [formData, setFormData] = useState<FormData>({
    dniCliente: '',
    nombreCliente: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ModificacionResponse | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [showConfirmation, setShowConfirmation] = useState(true);

  // Cargar datos iniciales del cliente
  useEffect(() => {
    if (cliente && isOpen) {
      setFormData({
        dniCliente: '',
        nombreCliente: '',
      });
      setError(null);
      setResultado(null);
      setValidationErrors({});
      setShowConfirmation(true);
    }
  }, [cliente, isOpen]);

  const validateField = (name: string, value: string): string | null => {
    // Si el campo está vacío, no validar (se usará el valor anterior)
    if (!value.trim()) return null;

    switch (name) {
      case 'dniCliente':
        if (!/^\d{7,8}$/.test(value)) {
          return 'El DNI debe tener entre 7 y 8 dígitos';
        }
        break;

      case 'nombreCliente':
        if (value.length < 3 || value.length > 100) {
          return 'El nombre debe tener entre 3 y 100 caracteres';
        }
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          return 'El nombre solo puede contener letras';
        }
        break;
    }

    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validar solo si el campo tiene contenido
    if (value.trim()) {
      const error = validateField(name, value);
      setValidationErrors(prev => ({
        ...prev,
        [name]: error || '',
      }));
    } else {
      // Limpiar error si el campo está vacío
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    if (!cliente) return;

    // Validar todos los campos con contenido
    const errors: { [key: string]: string } = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value.trim()) {
        const error = validateField(key, value);
        if (error) {
          errors[key] = error;
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Verificar que al menos un campo tenga contenido
    const hasChanges = Object.values(formData).some(value => value.trim() !== '');
    if (!hasChanges) {
      setError('Debe modificar al menos un campo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Construir el body solo con los campos que tienen valor
      const requestBody: any = {};
      if (formData.dniCliente.trim()) {
        requestBody.dniCliente = formData.dniCliente.trim();
      }
      if (formData.nombreCliente.trim()) {
        requestBody.nombreCliente = formData.nombreCliente.trim();
      }

      // Llamar a la función onConfirm que viene del padre
      const data = await onConfirm(cliente.id, requestBody);

      setResultado(data);
      setShowConfirmation(false);
    } catch (err: any) {
      console.error('Error completo:', err);
      setError(err.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (resultado) {
      onSuccess();
    }
    setFormData({
      dniCliente: '',
      nombreCliente: '',
    });
    setError(null);
    setResultado(null);
    setValidationErrors({});
    setShowConfirmation(true);
    onClose();
  };

  if (!isOpen || !cliente) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {showConfirmation ? (
          <>
            <h2>Modificar Cliente</h2>
            <div className="entity-info">
              <p><strong>Código:</strong> {cliente.codCliente}</p>
              <p><strong>Nombre actual:</strong> {cliente.nombreCliente}</p>
              <p><strong>DNI actual:</strong> {cliente.dniCliente}</p>
              <p><strong>Inmuebles asociados:</strong> {cliente.cantidadInmuebles}</p>
            </div>

            <div className="form-group">
              <label>DNI</label>
              <input
                type="text"
                name="dniCliente"
                value={formData.dniCliente}
                onChange={handleInputChange}
                placeholder={cliente.dniCliente}
                className={validationErrors.dniCliente ? 'input-error' : ''}
                disabled={loading}
              />
              {validationErrors.dniCliente && (
                <span className="error-message">{validationErrors.dniCliente}</span>
              )}
              <small className="field-hint">7-8 dígitos. Dejar vacío para mantener el actual.</small>
            </div>

            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombreCliente"
                value={formData.nombreCliente}
                onChange={handleInputChange}
                placeholder={cliente.nombreCliente}
                className={validationErrors.nombreCliente ? 'input-error' : ''}
                disabled={loading}
              />
              {validationErrors.nombreCliente && (
                <span className="error-message">{validationErrors.nombreCliente}</span>
              )}
              <small className="field-hint">3-100 caracteres, solo letras. Dejar vacío para mantener el actual.</small>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
              <button
                onClick={handleClose}
                disabled={loading}
                className="btn-cancelar"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || Object.keys(validationErrors).some(key => validationErrors[key])}
                className="btn-confirmar"
              >
                {loading ? 'Modificando...' : 'Modificar'}
              </button>
            </div>
          </>
        ) : (
          <>
            {resultado ? (
              <>
                <h2>✓ Cliente Modificado</h2>
                <div className="success-info">
                  <p><strong>Mensaje:</strong> {resultado.mensaje}</p>
                  <p><strong>Código:</strong> {resultado.codCliente}</p>
                  <p><strong>Nombre:</strong> {resultado.nombreCliente}</p>
                  
                  <div className="modified-fields">
                    <h3>Campos modificados:</h3>
                    {formData.dniCliente.trim() && (
                      <p>• <strong>DNI:</strong> {resultado.dniCliente}</p>
                    )}
                    {formData.nombreCliente.trim() && (
                      <p>• <strong>Nombre:</strong> {resultado.nombreCliente}</p>
                    )}
                  </div>
                </div>
                <div className="modal-actions">
                  <button onClick={handleClose} className="btn-aceptar">
                    Aceptar
                  </button>
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default ModalModificarCliente;