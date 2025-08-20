import { useState } from "react";
import type { Rol } from "../types";

type Props = {
    onConfirm: (roles: Rol[]) => void;
    onClose: () => void;
};

const TODOS_LOS_ROLES: Rol[] = [
    { id: 1, nombre: "Administrador" },
    { id: 2, nombre: "Supervisor" },
    { id: 3, nombre: "Empleado" },
];

export const ModalSeleccionarRoles = ({ onConfirm, onClose }: Props) => {
    const [seleccionados, setSeleccionados] = useState<number[]>([]);

    const toggle = (id: number) => {
        setSeleccionados((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const confirmar = () => {
        const rolesSeleccionados = TODOS_LOS_ROLES.filter((rol) => seleccionados.includes(rol.id));
        onConfirm(rolesSeleccionados);
        onClose();
    };

return (
    <div className="modal">
        <h3>Seleccionar Roles</h3>
        <ul>
            {TODOS_LOS_ROLES.map((rol) => (
            <li key={rol.id}>
                <label>
                <input
                    type="checkbox"
                    checked={seleccionados.includes(rol.id)}
                    onChange={() => toggle(rol.id)}
                />
                {rol.nombre}
                </label>
            </li>
            ))}
        </ul>
        <button onClick={confirmar}>Asignar</button>
        <button onClick={onClose}>Cancelar</button>
    </div>
  );
};
