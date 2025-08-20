"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/generalComponents/ui/dialog"
import { Button } from "@/generalComponents/ui/button"
import { PlusCircle, CheckCircle } from "lucide-react"

export default function ModalFinalizarTarea({ task, onClose, onAddTransaction, onFinishTask, transactions, setTransactions}) {
  // Filtramos las transacciones relacionadas con esta tarea
    const taskTransactions = transactions.filter((t) => t.taskId === task.id)

    const handleFinishTask = () => {
        onFinishTask()
        onClose()
    }

    const handleAddTransactionClick = () => {
        onAddTransaction()
        onClose()
    }

    const removeTransaction = (index) => {
        const updatedTransactions = transactions.filter((_, i) => i !== index)
        setTransactions(updatedTransactions)
    }

return (
    <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Finalizar Tarea: {task.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
                <div>
                    <h3 className="font-semibold mb-2">Detalles de la tarea:</h3>
                    <p>
                    <span className="font-medium">Ubicación:</span> {task.location}
                    </p>
                    <p>
                    <span className="font-medium">Fecha y hora:</span> {task.date.toLocaleString()}
                    </p>
                </div>

                // Mostramos las transacciones relacionadas con la tarea
                {taskTransactions.length > 0 && (
                    <div>
                        <h3 className="font-semibold mb-2">Transacciones registradas:</h3>
                        <div className="space-y-2">
                            {taskTransactions.map((transaction, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div>
                                        <p className="font-medium">
                                            {transaction.type === "ingreso" ? "Ingreso" : "Egreso"}: ${transaction.amount}
                                        </p>
                                        <p className="text-sm text-gray-600">{transaction.details}</p>
                                        <p className="text-xs text-gray-500">
                                            {transaction.category === "property"
                                            ? "Inmueble"
                                            : transaction.category === "employee"
                                                ? "Empleado"
                                                : "Supermercado"}
                                        </p>
                                    </div>

                                    <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => removeTransaction(index)}
                                    >
                                    Eliminar
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col space-y-2">
                    <Button onClick={handleAddTransactionClick} variant="outline" className="w-full">
                        <PlusCircle className="h-4 w-4 mr-2" /> Agregar Ingreso/Egreso
                    </Button>
                    <Button onClick={handleFinishTask} className="w-full">
                        <CheckCircle className="h-4 w-4 mr-2" /> Finalizar Tarea
                    </Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
)
}
