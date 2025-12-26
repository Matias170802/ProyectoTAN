import './MainPageReportes.css';
import React from 'react';
import { useState } from 'react';
import { ModalConsultarEstadisticasFinancieras } from '@/casosDeUso/ConsultarEstadisticas/components/ModalConsultarEstadisticasFinancieras/ModalConsultarEstadisticasFinancieras';
import { ModalConsultarEstadisticasGerencia } from '@/casosDeUso/ConsultarEstadisticas/components/ModalConsultarEstadisticasGerencia/ModalConsultarEstadisticasGerencia';

export const MainPageReportes: React.FC = () => {
    
    const [mostrarReportesGerencia, setMostrarReportesGerencia] = useState(false);
    const [mostrarReportesFinancieros, setMostrarReportesFinancieros] = useState(false);
    
    //aca deberia haber un hook que me traiga los roles del usuario logueado
    let roles;
    
    const definirReportesAMostrar = (roles: []) => {

        if (roles.includes('GERENCIA')) {
            setMostrarReportesGerencia(true);
        }
        if (roles.includes('FINANZAS')) {
            setMostrarReportesFinancieros(true);
        }
    }
    
    return (
        <div className="App">
            <div id='mainPageReportesContent'>
                <p className='titulo'>Reportes</p>

                <section id='reportesSection'>
                    <p>Aquí se mostrarán los reportes.</p>

                    {mostrarReportesFinancieros && (
                        <ModalConsultarEstadisticasFinancieras
                            isOpen={mostrarReportesFinancieros}
                            onClose={() => setMostrarReportesFinancieros(false)}
                        />
                    )}

                    {mostrarReportesGerencia && (
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