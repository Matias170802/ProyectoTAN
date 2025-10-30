"use client"

import { useState } from "react"
import { Button } from "@/generalComponents/ui/button"
import { Input } from "@/generalComponents/ui/input"
import { Label } from "@/generalComponents/ui/label"
import { Textarea } from "@/generalComponents/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/generalComponents/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/generalComponents/ui/card"
import { ArrowLeft, PlusCircle } from "lucide-react"

// Datos de ejemplo
const properties = [
    { id: 1, name: "Apartamento Centro" },
    { id: 2, name: "Casa de Playa" },
    { id: 3, name: "Cabaña Montaña" },
]

const employees = [
    { id: 1, name: "Ana Martínez" },
    { id: 2, name: "Roberto Sánchez" },
    { id: 3, name: "Laura Gómez" },
]

export default function FormularioAgregarIngresoEgreso ({ task, onAddTransaction, onFinish, existingTransactions }) {
    const [transactionType, setTransactionType] = useState("ingreso")
    const [category, setCategory] = useState("property")
    const [amount, setAmount] = useState("")
    const [details, setDetails] = useState("")
    const [selectedEntity, setSelectedEntity] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()

        //creo el nuevo movimiento
        const newTransaction = {
        taskId: task.id,
        type: transactionType,
        category,
        amount: Number.parseFloat(amount),
        details,
        entityId: selectedEntity,
        entityName: getEntityName(),
        date: new Date(),
        }

        onAddTransaction(newTransaction)

        // Limpiar el formulario
        setAmount("")
        setDetails("")
        setSelectedEntity("")
    }

    //no esta bien planteado
    const getEntityName = () => {
        if (category === "property") {
        return properties.find((p) => p.id.toString() === selectedEntity)?.name || ""
        } else if (category === "employee") {
        return employees.find((e) => e.id.toString() === selectedEntity)?.name || ""
        } else {
        return "Supermercado"
        }
    }

    const taskTransactions = existingTransactions.filter((t) => t.taskId === task.id)

return (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={onFinish} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver
            </Button>
            <h2 className="text-xl font-semibold">Agregar Ingreso/Egreso</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                {taskTransactions.length > 0 && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Transacciones Registradas</CardTitle>
                            <CardDescription>Transacciones ya agregadas para esta tarea</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {taskTransactions.map((transaction, index) => (
                                    <div key={index} className="p-3 bg-gray-50 rounded-md">
                                        <div className="flex justify-between">
                                            <p className="font-medium">
                                            {transaction.type === "ingreso" ? "Ingreso" : "Egreso"}: ${transaction.amount}
                                            </p>
                                            <p className="text-sm">
                                            {transaction.category === "property"
                                                ? "Inmueble"
                                                : transaction.category === "employee"
                                                ? "Empleado"
                                                : "Supermercado"}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-600">{transaction.details}</p>
                                        <p className="text-xs text-gray-500">{transaction.entityName}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Nueva Transacción</CardTitle>
                        <CardDescription>Agregar un nuevo ingreso o egreso</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="transactionType">Tipo de Transacción</Label>
                                <Select value={transactionType} onValueChange={setTransactionType}>
                                    <SelectTrigger id="transactionType">
                                        <SelectValue placeholder="Seleccionar tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ingreso">Ingreso</SelectItem>
                                        <SelectItem value="egreso">Egreso</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Categoría</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Seleccionar categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="property">Inmueble</SelectItem>
                                        <SelectItem value="employee">Empleado</SelectItem>
                                        <SelectItem value="supermarket">Supermercado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {category !== "supermarket" && (
                                <div className="space-y-2">
                                    <Label htmlFor="entity">{category === "property" ? "Inmueble" : "Empleado"}</Label>
                                    <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                                        <SelectTrigger id="entity">
                                            <SelectValue placeholder={`Seleccionar ${category === "property" ? "inmueble" : "empleado"}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {category === "property"
                                            ? properties.map((property) => (
                                                <SelectItem key={property.id} value={property.id.toString()}>
                                                    {property.name}
                                                </SelectItem>
                                                ))
                                            : employees.map((employee) => (
                                                <SelectItem key={employee.id} value={employee.id.toString()}>
                                                    {employee.name}
                                                </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="amount">Monto</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="details">Detalles</Label>
                                <Textarea
                                    id="details"
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    placeholder="Detalles de la transacción"
                                    rows={3}
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                <PlusCircle className="h-4 w-4 mr-2" /> Agregar Transacción
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
)
}
