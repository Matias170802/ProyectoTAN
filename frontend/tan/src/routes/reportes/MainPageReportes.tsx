import './MainPageReportes.css';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { ModalConsultarEstadisticasFinancieras } from '@/casosDeUso/ConsultarEstadisticas/components/ModalConsultarEstadisticasFinancieras/ModalConsultarEstadisticasFinancieras';
import { ModalConsultarEstadisticasGerencia } from '@/casosDeUso/ConsultarEstadisticas/components/ModalConsultarEstadisticasGerencia/ModalConsultarEstadisticasGerencia';
import { useFetch } from '@/generalHooks/useFetch';
import { type Rol} from './MainPageReportesTypes';
import { Button } from '@/generalComponents';

export const MainPageReportes: React.FC = () => {
    
    const [mostrarReportesGerencia, setMostrarReportesGerencia] = useState(false);
    const [mostrarReportesFinancieros, setMostrarReportesFinancieros] = useState(false);
    
    //TODO: aca deberia haber un hook que me traiga los roles del usuario logueado
    const { data: roles } = useFetch<Rol[]>('/api/reportes/roles');
    
    const definirReportesAMostrar = (roles: Rol[] | null) => {
        
        if (roles &&roles.some((rol) => rol.nombreRol.includes('Gerencia'))) {
            setMostrarReportesGerencia(true);
        }
        
        if (roles && roles.some((rol) => rol.nombreRol.includes('Administrador Financiero'))) {
            setMostrarReportesFinancieros(true);
        }
    }

    useEffect(() => {
        definirReportesAMostrar(roles);
    }, [roles]);
    
    return (
        <div className="App">
            <div id='mainPageReportesContent'>
                <p className='titulo'>Reportes</p>

                <section id='reportesSection'>
                    <p>Aquí se mostrarán los reportes.</p>

                    <Button
                    onClick={() => setMostrarReportesFinancieros(true)}
                    label='mostrar reportes financieros'
                    />
                    <Button
                    onClick={() => setMostrarReportesGerencia(true)}
                    label='mostrar reportes gerencia'
                    />

                    {mostrarReportesFinancieros && /*roles*/ (
                        <ModalConsultarEstadisticasFinancieras/>
                    )}

                    {mostrarReportesGerencia && /*roles*/ (
                        <ModalConsultarEstadisticasGerencia
                            isOpen={mostrarReportesGerencia}
                            onClose={() => setMostrarReportesGerencia(false)}
                        />
                    )}
                </section>
            </div>
        </div>
    )
}