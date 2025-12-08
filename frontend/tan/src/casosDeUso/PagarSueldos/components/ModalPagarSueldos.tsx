import './ModalPagarSueldos.css';
import {type PropsModalPagarSueldos} from './ModalPagarSueldosTypes'
import { Modal } from '../../../generalComponents/index';
import { usePagarSueldos } from '../hooks/usePagarSueldos';


export const ModalPagarSueldos: React.FC<PropsModalPagarSueldos> = ({cajaMadre, onClose, isOpen, showCloseButton, children}) => {

    const {empleados, loadingEmpleados, refetchEmpleados, errorEmpleados} = usePagarSueldos();


    return (
        <Modal
        isOpen={isOpen}
        onClose={onClose}
        showCloseButton={showCloseButton}
        title='Pagar Sueldos'
        description='Seleccione a un empleado al cual desea pagarle el sueldo'
        >

        <section id='contenedorContenidoPagarSueldos'>
            <div id='selectEmpleado'>
                <label>Empleado</label>

                <select>
                    <option value={"SeleccioneUnEmpelado"}>Seleccione un empleado</option>
                    {!loadingEmpleados && !errorEmpleados && empleados && empleados.map((empleado) => (
                        <option key={empleado.dniEmpleado} value={empleado.dniEmpleado}>
                            {empleado.nombreEmpleado}
                        </option>
                    ))}
                </select>
            </div>

            <div id='contenedorSueldoEmpleado'>
                <p>Sueldo a pagar: </p>
                <span>
                    {//*hacer un watch del select para poder leer el sueldo del empleado seleccionado}
                </span>
            </div>
        </section>

        </Modal>
    )
}