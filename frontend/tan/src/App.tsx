"use client"

import { useState } from "react"
import Calendar from "@/components/Calendar"
import TaskList from "@/components/TaskList"
import TopBar from "@/components/TopBar"
import TransactionForm from "@/components/TransactionForm"

export default function Home() {
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [transactions, setTransactions] = useState([])

  const handleAddTransaction = (transaction) => {
    setTransactions([...transactions, transaction])
  }

  const handleFinishTransactions = () => {
    setShowTransactionForm(false)
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <TopBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Panel de Control</h1>

        {showTransactionForm ? (
          <TransactionForm
            task={currentTask}
            onAddTransaction={handleAddTransaction}
            onFinish={handleFinishTransactions}
            existingTransactions={transactions}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Calendario</h2>
              <Calendar />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Tareas Asignadas</h2>
              <TaskList
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

/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
*/
export default App
