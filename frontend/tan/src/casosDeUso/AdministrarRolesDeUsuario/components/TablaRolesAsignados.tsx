// features/roles/components/TablaRolesAsignados.tsx

import type { Rol } from "../types";

type Props = {
    roles: Rol[];
    onDesasignar: (rolId: number) => void;
};

export const TablaRolesAsignados = ({ roles, onDesasignar }: Props) => (
    <table>
        <thead>
            <tr>
                <th>Rol</th>
                <th>Acción</th>
            </tr>
        </thead>
        <tbody>
            {roles.map((rol) => (
                <tr key={rol.id}>
                <td>{rol.nombre}</td>
                <td>
                    <button onClick={() => onDesasignar(rol.id)}>🗑️</button>
                </td>
                </tr>
            ))}
        </tbody>
    </table>
);
