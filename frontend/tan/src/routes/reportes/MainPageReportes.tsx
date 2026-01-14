import './MainPageReportes.css';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { ModalConsultarEstadisticasFinancieras } from '@/casosDeUso/ConsultarEstadisticas/components/ModalConsultarEstadisticasFinancieras/ModalConsultarEstadisticasFinancieras';
import { ModalConsultarEstadisticasGerencia } from '@/casosDeUso/ConsultarEstadisticas/components/ModalConsultarEstadisticasGerencia/ModalConsultarEstadisticasGerencia';
import { useFetch } from '@/generalHooks/useFetch';
import { type Rol} from './MainPageReportesTypes';

export const MainPageReportes: React.FC = () => {
    
    const [mostrarReportesGerencia, setMostrarReportesGerencia] = useState(false);
    const [mostrarReportesFinancieros, setMostrarReportesFinancieros] = useState(false);
    const [reporteSeleccionado, setReporteSeleccionado] = useState<'gerencia' | 'finanzas'>('gerencia');

    //me traigo los roles del usuario logueado
    const { data: roles } = useFetch<Rol[]>('/api/reportes/roles');
    
    const definirReportesAMostrar = (roles: Rol[] | null) => {
        
        if (roles &&roles.some((rol) => rol.nombreRol.includes('Gerencia'))) {
            setMostrarReportesGerencia(true);
        }
        
        if (roles && roles.some((rol) => rol.nombreRol.includes('Administrador Financiero'))) {
            setMostrarReportesFinancieros(true);
        }
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setReporteSeleccionado(event.target.value as 'gerencia' | 'finanzas');
    }

    useEffect(() => {
        definirReportesAMostrar(roles);
    }, [roles]);
    
    return (
        <div className="App">
            <div id='mainPageReportesContent'>
                <p className='titulo'>Reportes</p>

                <section id='reportesSection'>
                    
                    {mostrarReportesFinancieros && roles && !mostrarReportesGerencia &&(
                        <ModalConsultarEstadisticasFinancieras/>
                    )}

                    {mostrarReportesGerencia && roles && !mostrarReportesFinancieros &&(
                        <ModalConsultarEstadisticasGerencia/>
                    )}

                    {mostrarReportesFinancieros && mostrarReportesGerencia && roles && (
                        <section id='contenedorReportesConSelect'>
                            <div id='contenedorElegirReportes'>
                                <select value={reporteSeleccionado} onChange={handleSelectChange}>
                                    <option value="gerencia">Reportes Gerencia</option>
                                    <option value="finanzas">Reportes Finanzas</option>
                                </select>
                            </div>

                            <section id='reportesSegunSeleccion'>
                                {reporteSeleccionado === 'gerencia' && <ModalConsultarEstadisticasGerencia/>}
                                {reporteSeleccionado === 'finanzas' && <ModalConsultarEstadisticasFinancieras/>}
                            </section>

                        </section>
                    )}
                </section>
            </div>
        </div>
    )
}