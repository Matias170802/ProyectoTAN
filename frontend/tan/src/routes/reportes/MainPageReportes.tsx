import './MainPageReportes.css';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { ModalConsultarEstadisticasFinancieras } from '@/casosDeUso/ConsultarEstadisticas/components/ModalConsultarEstadisticasFinancieras/ModalConsultarEstadisticasFinancieras';
import { ModalConsultarEstadisticasGerencia } from '@/casosDeUso/ConsultarEstadisticas/components/ModalConsultarEstadisticasGerencia/ModalConsultarEstadisticasGerencia';

export const MainPageReportes: React.FC = () => {
    
    const [mostrarReportesGerencia, setMostrarReportesGerencia] = useState(false);
    const [mostrarReportesFinancieros, setMostrarReportesFinancieros] = useState(false);
    
    //TODO: aca deberia haber un hook que me traiga los roles del usuario logueado
    let roles;
    
    const definirReportesAMostrar = (roles: []) => {

        if (roles.includes('Gerencia')) {
            setMostrarReportesGerencia(true);
        }
        if (roles.includes('Administrador Financiero')) {
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

                    {mostrarReportesFinancieros && roles && (
                        <ModalConsultarEstadisticasFinancieras
                            isOpen={mostrarReportesFinancieros}
                            onClose={() => setMostrarReportesFinancieros(false)}
                        />
                    )}

                    {mostrarReportesGerencia && roles && (
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