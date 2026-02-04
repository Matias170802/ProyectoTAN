import React, { useState, useEffect } from 'react';
import './ModalAltaEntidad.css';

interface Empleado {
  id: number;
  codEmpleado: string;
  nombreEmpleado: string;
  dniEmpleado: string;
  codigosRoles: string[];
  nombresRoles: string[];
  balanceCajaARS: number;
  balanceCajaUSD: number;
  activo: boolean;
}

interface ModalModificarEmpleadoProps {
  isOpen: boolean;
  onClose: () => void;
  empleado: Empleado | null;
  onSuccess: () => void;
  onConfirm: (id: number, data: any) => Promise<any>;
}

interface FormData {
  dniEmpleado: string;
  nombreEmpleado: string;
  nroTelefonoEmpleado: string;
  salarioEmpleado: string;
}

interface ModificacionResponse {
  mensaje: string;
  exito: boolean;
  empleado: {
    id: number;
    codEmpleado: string;
    nombreEmpleado: string;
    dniEmpleado: string;
    nroTelefonoEmpleado: string;
    salarioEmpleado: number;
    rolesActivos: string[];
    fechaModificacion: string;
  };
}

const ModalModificarEmpleado: React.FC<ModalModificarEmpleadoProps> = ({
  isOpen,
  onClose,
  empleado,
  onSuccess,
  onConfirm,
}) => {
  const [formData, setFormData] = useState<FormData>({
    dniEmpleado: '',
    nombreEmpleado: '',
    nroTelefonoEmpleado: '',
    salarioEmpleado: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ModificacionResponse | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [showConfirmation, setShowConfirmation] = useState(true);

  // Cargar datos iniciales del empleado
  useEffect(() => {
    if (empleado && isOpen) {
      setFormData({
        dniEmpleado: '',
        nombreEmpleado: '',
        nroTelefonoEmpleado: '',
        salarioEmpleado: '',
      });
      setError(null);
      setResultado(null);
      setValidationErrors({});
      setShowConfirmation(true);
    }
  }, [empleado, isOpen]);

  const validateField = (name: string, value: string): string | null => {
    // Si el campo está vacío, no validar (se usará el valor anterior)
    if (!value.trim()) return null;

    switch (name) {
      case 'dniEmpleado':
        if (!/^\d{7,8}$/.test(value)) {
          return 'El DNI debe tener entre 7 y 8 dígitos';
        }
        break;

      case 'nombreEmpleado':
        if (value.length < 3 || value.length > 50) {
          return 'El nombre debe tener entre 3 y 50 caracteres';
        }
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          return 'El nombre solo puede contener letras';
        }
        break;

      case 'nroTelefonoEmpleado':
        if (!/^\d{10}$/.test(value)) {
          return 'El teléfono debe tener 10 dígitos';
        }
        break;

      case 'salarioEmpleado':
        const salario = Number(value);
        if (isNaN(salario) || salario <= 0) {
          return 'El salario debe ser un valor positivo';
        }
        if (salario > 99999999) {
          return 'El salario excede el límite permitido';
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
    if (!empleado) return;

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
      if (formData.dniEmpleado.trim()) {
        requestBody.dniEmpleado = formData.dniEmpleado.trim();
      }
      if (formData.nombreEmpleado.trim()) {
        requestBody.nombreEmpleado = formData.nombreEmpleado.trim();
      }
      if (formData.nroTelefonoEmpleado.trim()) {
        requestBody.nroTelefonoEmpleado = formData.nroTelefonoEmpleado.trim();
      }
      if (formData.salarioEmpleado.trim()) {
        requestBody.salarioEmpleado = Number(formData.salarioEmpleado);
      }

      // Llamar a la función onConfirm que viene del padre
      const data = await onConfirm(empleado.id, requestBody);

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
      dniEmpleado: '',
      nombreEmpleado: '',
      nroTelefonoEmpleado: '',
      salarioEmpleado: '',
    });
    setError(null);
    setResultado(null);
    setValidationErrors({});
    setShowConfirmation(true);
    onClose();
  };

  if (!isOpen || !empleado) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {showConfirmation ? (
          <>
            <h2>Modificar Empleado</h2>
            <div className="entity-info">
              <p><strong>Código:</strong> {empleado.codEmpleado}</p>
              <p><strong>Nombre actual:</strong> {empleado.nombreEmpleado}</p>
              <p><strong>DNI actual:</strong> {empleado.dniEmpleado}</p>
            </div>

            <div className="form-group">
              <label>DNI</label>
              <input
                type="text"
                name="dniEmpleado"
                value={formData.dniEmpleado}
                onChange={handleInputChange}
                placeholder={empleado.dniEmpleado}
                className={validationErrors.dniEmpleado ? 'input-error' : ''}
                disabled={loading}
              />
              {validationErrors.dniEmpleado && (
                <span className="error-message">{validationErrors.dniEmpleado}</span>
              )}
              <small className="field-hint">7-8 dígitos. Dejar vacío para mantener el actual.</small>
            </div>

            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombreEmpleado"
                value={formData.nombreEmpleado}
                onChange={handleInputChange}
                placeholder={empleado.nombreEmpleado}
                className={validationErrors.nombreEmpleado ? 'input-error' : ''}
                disabled={loading}
              />
              {validationErrors.nombreEmpleado && (
                <span className="error-message">{validationErrors.nombreEmpleado}</span>
              )}
              <small className="field-hint">3-50 caracteres, solo letras. Dejar vacío para mantener el actual.</small>
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                name="nroTelefonoEmpleado"
                value={formData.nroTelefonoEmpleado}
                onChange={handleInputChange}
                placeholder="Teléfono actual (nuevo valor opcional)"
                className={validationErrors.nroTelefonoEmpleado ? 'input-error' : ''}
                disabled={loading}
              />
              {validationErrors.nroTelefonoEmpleado && (
                <span className="error-message">{validationErrors.nroTelefonoEmpleado}</span>
              )}
              <small className="field-hint">10 dígitos. Dejar vacío para mantener el actual.</small>
            </div>

            <div className="form-group">
              <label>Salario</label>
              <input
                type="number"
                name="salarioEmpleado"
                value={formData.salarioEmpleado}
                onChange={handleInputChange}
                placeholder="Salario actual (nuevo valor opcional)"
                className={validationErrors.salarioEmpleado ? 'input-error' : ''}
                disabled={loading}
                min="1"
                max="99999999"
              />
              {validationErrors.salarioEmpleado && (
                <span className="error-message">{validationErrors.salarioEmpleado}</span>
              )}
              <small className="field-hint">Valor positivo, máximo 99,999,999. Dejar vacío para mantener el actual.</small>
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
                <h2>✓ Empleado Modificado</h2>
                <div className="success-info">
                  <p><strong>Mensaje:</strong> {resultado.mensaje}</p>
                  <p><strong>Código:</strong> {resultado.empleado.codEmpleado}</p>
                  <p><strong>Nombre:</strong> {resultado.empleado.nombreEmpleado}</p>
                  
                  <div className="modified-fields">
                    <h3>Campos modificados:</h3>
                    {formData.dniEmpleado.trim() && (
                      <p>• <strong>DNI:</strong> {resultado.empleado.dniEmpleado}</p>
                    )}
                    {formData.nombreEmpleado.trim() && (
                      <p>• <strong>Nombre:</strong> {resultado.empleado.nombreEmpleado}</p>
                    )}
                    {formData.nroTelefonoEmpleado.trim() && (
                      <p>• <strong>Teléfono:</strong> {resultado.empleado.nroTelefonoEmpleado}</p>
                    )}
                    {formData.salarioEmpleado.trim() && (
                      <p>• <strong>Salario:</strong> ${resultado.empleado.salarioEmpleado.toLocaleString()}</p>
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

export default ModalModificarEmpleado;