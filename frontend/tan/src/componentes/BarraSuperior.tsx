"use client"

import { useState } from "react"
import { Link } from 'react-router-dom'
import { Button } from "@/componentes/ui/button"
import { Wallet, Bell, User, PlusCircle, Home, Calendar, DollarSign } from "lucide-react"

// Simulamos un usuario administrador financiero, se deberia verificar el rol para saber que mostrarle en la barra superior
const isFinancialAdmin = true

export default function BarraSuperior() {
    const [notificationCount, setNotificationCount] = useState(3)

return (
    <header className="bg-white shadow sticky top-0 z-10">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold mr-6">Gestión de Propiedades</h1>
                <div className="hidden md:flex space-x-1">
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/">
                            <Home className="h-4 w-4 mr-2" /> Inicio
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/reservas">
                            <Calendar className="h-4 w-4 mr-2" /> Reservas
                        </Link>
                    </Button>
                    
                    {isFinancialAdmin && (
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/finanzas">
                        <DollarSign className="h-4 w-4 mr-2" /> Finanzas
                        </Link>
                    </Button>
                    )}

                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm">
                    <Link href="/mi-caja">
                    <Wallet className="h-4 w-4 mr-2" /> Mi Caja
                    </Link>
                </Button>

                <Button asChild variant="ghost" size="sm">
                    <Link href="/perfil">
                        <User className="h-4 w-4 mr-2" /> Mi Perfil
                    </Link>
                </Button>

                <Button asChild size="sm">
                    <Link href="/agregar-ingreso-egreso">
                        <PlusCircle className="h-4 w-4 mr-2" /> Agregar Ingreso/Egreso
                    </Link>
                </Button>
            </div>
        </nav>
    </header>
)
}
