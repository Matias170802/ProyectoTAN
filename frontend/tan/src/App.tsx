"use client"

import { useState } from "react"
import ListaTarea from "@/componentes/ListaTareas"
import BarraSuperior from "@/componentes/BarraSuperior"
import FormularioAgregarIngresoEgreso from "@/componentes/FormularioAgregarIngresoEgreso"

export default function Inicio() {
  //para mostrar el formulario de agregar ingreso/egreso
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  //para manejar la tarea actual seleccionada
  const [currentTask, setCurrentTask] = useState(null)
  //para manejar las transacciones
  const [transactions, setTransactions] = useState([])

  const handleAddTransaction = (transaction) => {
    setTransactions([...transactions, transaction])
  }

  const handleFinishTransactions = () => {
    setShowTransactionForm(false)
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <BarraSuperior/>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Panel de Control</h1>

        {showTransactionForm ? (
          <FormularioAgregarIngresoEgreso
            task={currentTask}
            onAddTransaction={handleAddTransaction}
            onFinish={handleFinishTransactions}
            existingTransactions={transactions}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Tareas Asignadas</h2>
              <ListaTarea
                onTaskSelect={(task) => setCurrentTask(task)}
                onAddTransaction={() => setShowTransactionForm(true)}
                transactions={transactions}
                setTransactions={setTransactions}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

