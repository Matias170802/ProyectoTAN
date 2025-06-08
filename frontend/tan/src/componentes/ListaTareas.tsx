"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/componentes/ui/card"
import { Button } from "@/componentes/ui/button"
import { Badge } from "@/componentes/ui/badge"
import { CheckCircle, Info } from "lucide-react"
import ModalFinalizarTarea from "./ModalFinalizarTarea"
import ModalDetallesTarea from "./ModalDetallesTarea"

// Datos de ejemplo
const tasks = [
    {
    id: 1,
    title: "Check-in: Apartamento Centro",
    date: new Date(2025, 3, 15, 12, 0),
    type: "check-in",
    location: "Apartamento Centro, Calle Principal 123",
    description: "Recibir a Juan Pérez y familia (2 adultos, 1 niño)",
    status: "pending",
    },
    {
    id: 2,
    title: "Check-out: Casa de Playa",
    date: new Date(2025, 3, 16, 10, 0),
    type: "check-out",
    location: "Casa de Playa, Av. Costanera 456",
    description: "Despedir a María González y verificar inventario",
    status: "pending",
    },
    {
    id: 3,
    title: "Mantenimiento: Cabaña Montaña",
    date: new Date(2025, 3, 17, 9, 0),
    type: "maintenance",
    location: "Cabaña Montaña, Ruta 7 km 45",
    description: "Reparar calefacción y revisar cañerías",
    status: "pending",
    },
]

export default function ListaTareas({ onTaskSelect, onAddTransaction, transactions, setTransactions }) {
    
    //hook para manejar la tarea seleccionada
    const [selectedTask, setSelectedTask] = useState(null)
    //hooks para manejar los modales de detalle y finalización de tareas
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [showFinishModal, setShowFinishModal] = useState(false)
    //hook para armar la lsita de tareas
    const [taskList, setTaskList] = useState(tasks)

    const handleTaskClick = (task) => {
        setSelectedTask(task)
        setShowDetailModal(true)
        onTaskSelect(task)
    }

    const handleFinishTask = (task) => {
        setSelectedTask(task)
        setShowFinishModal(true)
        onTaskSelect(task)
    }

    const completeTask = (taskId) => {
        setTaskList(taskList.map((task) => (task.id === taskId ? { ...task, status: "completed" } : task)))
        setShowFinishModal(false)
    }

    const getBadgeColor = (type) => {
        switch (type) {
        case "check-in":
            return "bg-green-100 text-green-800"
        case "check-out":
            return "bg-red-100 text-red-800"
        default:
            return "bg-blue-100 text-blue-800"
        }
    }

return (
    <div className="space-y-4">
        {taskList
            .filter((task) => task.status === "pending")
            .map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <Badge className={getBadgeColor(task.type)}>
                            {task.type === "check-in" ? "Check-in" : "Check-out"}
                        </Badge>
                    </div>
                    <CardDescription>
                        {task.date.toLocaleDateString()} -{" "}
                        {task.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </CardDescription>
                </CardHeader>

                <CardContent className="pb-2">
                    <p className="text-sm text-gray-600 truncate">{task.location}</p>
                </CardContent>

                <CardFooter className="flex justify-between pt-0">
                    <Button variant="outline" size="sm" onClick={() => handleTaskClick(task)}>
                        <Info className="h-4 w-4 mr-1" /> Detalles
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                        onClick={() => handleFinishTask(task)}
                    >
                        <CheckCircle className="h-4 w-4 mr-1" /> Finalizar
                    </Button>
                </CardFooter>
            </Card>
            ))
        }

        //en el caso de que no hayan tareas pendientes, mostramos un mensaje
        {taskList.filter((task) => task.status === "pending").length === 0 && (
            <div className="text-center py-8 text-gray-500">No hay tareas pendientes</div>
        )}

        //cuando tenemos abierto el detalle de la tarea y una tarea seleccionada, escucha si se selecciona pra cerrar y pone al hook en falso, para indicar que se cerro
        {showDetailModal && selectedTask && (
            <ModalDetallesTarea task={selectedTask} onClose={() => setShowDetailModal(false)} />
        )}

        {showFinishModal && selectedTask && (
            <ModalFinalizarTarea
            task={selectedTask}
            onClose={() => setShowFinishModal(false)}
            onAddTransaction={onAddTransaction}
            onFinishTask={() => completeTask(selectedTask.id)}
            transactions={transactions}
            setTransactions={setTransactions}
            />
        )}
    </div>
)
}
