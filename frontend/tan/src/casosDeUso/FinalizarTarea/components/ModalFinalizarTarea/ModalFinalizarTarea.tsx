import {type PropsFinalizarTarea} from './ModalFinalizarTareaTypes'
import {Modal, Button} from '../../../../generalComponents/index';
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
import './ModalFinalizarTarea.css';

export const ModalFinalizarTarea: React.FC<PropsFinalizarTarea> = ({isOpen, onClose, title, description, tarea, showCloseButton}) => {

    return (
        <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        description={description}
        showCloseButton={showCloseButton}
        >
            <div id='contenedorContenidoModal'>
                <section id='seccionDetallesTarea'>
                    <p id='tituloDetallesTarea'>Detalles de la tarea:</p>
                    <p className='detallesTareaTexto'>Ubicación: {tarea.ubicacionTarea}</p>
                    <p className='detallesTareaTexto'>Fecha y hora: {tarea.fechaTarea}, {tarea.horaTarea}</p>
                </section>

                <section id='contenedorBotones'>
                    <Button
                    label='Agregar Ingreso Egreso'
                    icon={<IoMdAddCircleOutline/>}
                    onClick={()=>{}}
                    id='botonAgregarIngreso'
                    />

                    <Button
                    label='Finalizar Tarea'
                    icon={<FaRegCheckCircle />}
                    onClick={()=>{}}
                    id='botonFinalizarTarea'
                    />
                </section>

            </div>
        </Modal>
    )
}