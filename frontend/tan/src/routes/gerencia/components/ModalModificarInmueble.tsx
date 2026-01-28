import React, { useState, useEffect } from 'react';
import './ModalAltaEntidad.css';

interface Inmueble {
  id: number;
  codInmueble: string;
  nombreInmueble: string;
  cantidadBaños: number;
  cantidadDormitorios: number;
  capacidad: number;
  direccion: string;
  m2Inmueble: number;
  precioPorNocheUSD: number;
  fechaHoraAltaInmueble: string;
  codCliente: string;
  nombreCliente: string;
  activo: boolean;
}

interface ModalModificarInmuebleProps {
  isOpen: boolean;
  onClose: () => void;
  inmueble: Inmueble | null;
  onSuccess: () => void;
  onConfirm: (id: number, data: any) => Promise<any>;
}

interface FormData {
  cantidadBaños: string;
  cantidadDormitorios: string;
  capacidad: string;
  m2Inmueble: string;
  precioPorNocheUSD: string;
}

interface ModificacionResponse {
  mensaje: string;
  exito: boolean;
  inmueble: {
    id: number;
    codInmueble: string;
    nombreInmueble: string;
    cantidadBaños: number;
    cantidadDormitorios: number;
    capacidad: number;
    m2Inmueble: number;
    precioPorNocheUSD: number;
    fechaModificacion: string;
  };
}

const ModalModificarInmueble: React.FC<ModalModificarInmuebleProps> = ({
  isOpen,
  onClose,
  inmueble,
  onSuccess,
  onConfirm,
}) => {
  const [formData, setFormData] = useState<FormData>({
    cantidadBaños: '',
    cantidadDormitorios: '',
    capacidad: '',
    m2Inmueble: '',
    precioPorNocheUSD: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ModificacionResponse | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [showConfirmation, setShowConfirmation] = useState(true);

  // Cargar datos iniciales del inmueble
  useEffect(() => {
    if (inmueble && isOpen) {
      setFormData({
        cantidadBaños: '',
        cantidadDormitorios: '',
        capacidad: '',
        m2Inmueble: '',
        precioPorNocheUSD: '',
      });
      setError(null);
      setResultado(null);
      setValidationErrors({});
      setShowConfirmation(true);
    }
  }, [inmueble, isOpen]);

  const validateField = (name: string, value: string): string | null => {
    // Si el campo está vacío, no validar (se usará el valor anterior)
    if (!value.trim()) return null;

    const numValue = Number(value);

    switch (name) {
      case 'cantidadBaños':
        if (isNaN(numValue) || numValue < 1 || numValue > 20) {
          return 'La cantidad de baños debe estar entre 1 y 20';
        }
        if (!Number.isInteger(numValue)) {
          return 'La cantidad de baños debe ser un número entero';
        }
        break;

      case 'cantidadDormitorios':
        if (isNaN(numValue) || numValue < 1 || numValue > 20) {
          return 'La cantidad de dormitorios debe estar entre 1 y 20';
        }
        if (!Number.isInteger(numValue)) {
          return 'La cantidad de dormitorios debe ser un número entero';
        }
        break;

      case 'capacidad':
        if (isNaN(numValue) || numValue < 1 || numValue > 50) {
          return 'La capacidad debe estar entre 1 y 50 personas';
        }
        if (!Number.isInteger(numValue)) {
          return 'La capacidad debe ser un número entero';
        }
        break;

      case 'm2Inmueble':
        if (isNaN(numValue) || numValue < 10 || numValue > 10000) {
          return 'Los m² deben estar entre 10 y 10,000';
        }
        break;

      case 'precioPorNocheUSD':
        if (isNaN(numValue) || numValue < 1 || numValue > 100000) {
          return 'El precio debe estar entre 1 y 100,000 USD';
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
    if (!inmueble) return;

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
      if (formData.cantidadBaños.trim()) {
        requestBody.cantidadBaños = Number(formData.cantidadBaños);
      }
      if (formData.cantidadDormitorios.trim()) {
        requestBody.cantidadDormitorios = Number(formData.cantidadDormitorios);
      }
      if (formData.capacidad.trim()) {
        requestBody.capacidad = Number(formData.capacidad);
      }
      if (formData.m2Inmueble.trim()) {
        requestBody.m2Inmueble = Number(formData.m2Inmueble);
      }
      if (formData.precioPorNocheUSD.trim()) {
        requestBody.precioPorNocheUSD = Number(formData.precioPorNocheUSD);
      }

      // Llamar a la función onConfirm que viene del padre
      const data = await onConfirm(inmueble.id, requestBody);

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
      cantidadBaños: '',
      cantidadDormitorios: '',
      capacidad: '',
      m2Inmueble: '',
      precioPorNocheUSD: '',
    });
    setError(null);
    setResultado(null);
    setValidationErrors({});
    setShowConfirmation(true);
    onClose();
  };

  if (!isOpen || !inmueble) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {showConfirmation ? (
          <>
            <h2>Modificar Inmueble</h2>
            <div className="entity-info">
              <p><strong>Código:</strong> {inmueble.codInmueble}</p>
              <p><strong>Nombre:</strong> {inmueble.nombreInmueble}</p>
              <p><strong>Dirección:</strong> {inmueble.direccion}</p>
              <p><strong>Cliente:</strong> {inmueble.nombreCliente} ({inmueble.codCliente})</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Cantidad de Baños</label>
                <input
                  type="number"
                  name="cantidadBaños"
                  value={formData.cantidadBaños}
                  onChange={handleInputChange}
                  placeholder={inmueble.cantidadBaños.toString()}
                  className={validationErrors.cantidadBaños ? 'input-error' : ''}
                  disabled={loading}
                  min="1"
                  max="20"
                />
                {validationErrors.cantidadBaños && (
                  <span className="error-message">{validationErrors.cantidadBaños}</span>
                )}
                <small className="field-hint">Actual: {inmueble.cantidadBaños}. Rango: 1-20</small>
              </div>

              <div className="form-group">
                <label>Cantidad de Dormitorios</label>
                <input
                  type="number"
                  name="cantidadDormitorios"
                  value={formData.cantidadDormitorios}
                  onChange={handleInputChange}
                  placeholder={inmueble.cantidadDormitorios.toString()}
                  className={validationErrors.cantidadDormitorios ? 'input-error' : ''}
                  disabled={loading}
                  min="1"
                  max="20"
                />
                {validationErrors.cantidadDormitorios && (
                  <span className="error-message">{validationErrors.cantidadDormitorios}</span>
                )}
                <small className="field-hint">Actual: {inmueble.cantidadDormitorios}. Rango: 1-20</small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Capacidad (personas)</label>
                <input
                  type="number"
                  name="capacidad"
                  value={formData.capacidad}
                  onChange={handleInputChange}
                  placeholder={inmueble.capacidad.toString()}
                  className={validationErrors.capacidad ? 'input-error' : ''}
                  disabled={loading}
                  min="1"
                  max="50"
                />
                {validationErrors.capacidad && (
                  <span className="error-message">{validationErrors.capacidad}</span>
                )}
                <small className="field-hint">Actual: {inmueble.capacidad}. Rango: 1-50</small>
              </div>

              <div className="form-group">
                <label>M² del Inmueble</label>
                <input
                  type="number"
                  name="m2Inmueble"
                  value={formData.m2Inmueble}
                  onChange={handleInputChange}
                  placeholder={inmueble.m2Inmueble.toString()}
                  className={validationErrors.m2Inmueble ? 'input-error' : ''}
                  disabled={loading}
                  min="10"
                  max="10000"
                  step="0.01"
                />
                {validationErrors.m2Inmueble && (
                  <span className="error-message">{validationErrors.m2Inmueble}</span>
                )}
                <small className="field-hint">Actual: {inmueble.m2Inmueble} m². Rango: 10-10,000</small>
              </div>
            </div>

            <div className="form-group">
              <label>Precio por Noche (USD)</label>
              <input
                type="number"
                name="precioPorNocheUSD"
                value={formData.precioPorNocheUSD}
                onChange={handleInputChange}
                placeholder={inmueble.precioPorNocheUSD.toString()}
                className={validationErrors.precioPorNocheUSD ? 'input-error' : ''}
                disabled={loading}
                min="1"
                max="100000"
                step="0.01"
              />
              {validationErrors.precioPorNocheUSD && (
                <span className="error-message">{validationErrors.precioPorNocheUSD}</span>
              )}
              <small className="field-hint">Actual: ${inmueble.precioPorNocheUSD}. Rango: 1-100,000 USD</small>
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
                <h2>✓ Inmueble Modificado</h2>
                <div className="success-info">
                  <p><strong>Mensaje:</strong> {resultado.mensaje}</p>
                  <p><strong>Código:</strong> {resultado.inmueble.codInmueble}</p>
                  <p><strong>Nombre:</strong> {resultado.inmueble.nombreInmueble}</p>
                  
                  <div className="modified-fields">
                    <h3>Campos modificados:</h3>
                    {formData.cantidadBaños.trim() && (
                      <p>• <strong>Cantidad de Baños:</strong> {resultado.inmueble.cantidadBaños}</p>
                    )}
                    {formData.cantidadDormitorios.trim() && (
                      <p>• <strong>Cantidad de Dormitorios:</strong> {resultado.inmueble.cantidadDormitorios}</p>
                    )}
                    {formData.capacidad.trim() && (
                      <p>• <strong>Capacidad:</strong> {resultado.inmueble.capacidad} personas</p>
                    )}
                    {formData.m2Inmueble.trim() && (
                      <p>• <strong>M²:</strong> {resultado.inmueble.m2Inmueble} m²</p>
                    )}
                    {formData.precioPorNocheUSD.trim() && (
                      <p>• <strong>Precio por Noche:</strong> ${resultado.inmueble.precioPorNocheUSD} USD</p>
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

export default ModalModificarInmueble;