"use client"

import { useState } from "react"
import { Button } from "@/generalComponents/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/generalComponents/ui/card"
import { Badge } from "@/generalComponents/ui/badge"
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger} from "@/generalComponents/ui/dialog"
import { Input } from "@/generalComponents/ui/input"
import { Label } from "@/generalComponents/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/generalComponents/ui/tabs"
import { Settings, Users, Edit, Trash2, Shield, UserCheck } from "lucide-react"
import BarraSuperior from "@/generalComponents/componentesViejosDeGuia/BarraSuperior"
import ModalAdministrarRolesUsuario from "@/casosDeUso/AdministrarRolesDeUsuario/components/ModalAdministrarRolesUsuario"

interface Role {
    id: string
    name: string
    description: string
    permissions: string[]
    userCount: number
}

interface User {
    id: string
    name: string
    email: string
    role: string
    status: "active" | "inactive"
}

export default function AdminView() {
    const [activeTab, setActiveTab] = useState("dashboard")
    const [roles, setRoles] = useState<Role[]>([
        {
        id: "1",
        name: "Administrador",
        description: "Acceso completo al sistema",
        permissions: ["read", "write", "delete", "admin"],
        userCount: 2,
        },
        {
        id: "2",
        name: "Editor",
        description: "Puede crear y editar contenido",
        permissions: ["read", "write"],
        userCount: 5,
        },
        {
        id: "3",
        name: "Viewer",
        description: "Solo lectura",
        permissions: ["read"],
        userCount: 12,
        },
        {
        id: "4",
        name: "Empleado",
        description: "Acceso básico para empleados",
        permissions: ["read"],
        userCount: 8,
        },
        {
        id: "5",
        name: "Administrador Financiero",
        description: "Gestión de aspectos financieros y contables",
        permissions: ["read", "write", "finance", "reports"],
        userCount: 3,
        },
    ])

    const [users, setUsers] = useState<User[]>([
        { id: "1", name: "Juan Pérez", email: "juan@example.com", role: "Administrador", status: "active" },
        { id: "2", name: "María García", email: "maria@example.com", role: "Editor", status: "active" },
        { id: "3", name: "Carlos López", email: "carlos@example.com", role: "Viewer", status: "inactive" },
    ])

    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
    const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)
    const [isManageUsersOpen, setIsManageUsersOpen] = useState(false)

    // Agregar nuevos estados después de los estados existentes
    const [searchDni, setSearchDni] = useState("")
    const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null)
    const [isAssignRoleOpen, setIsAssignRoleOpen] = useState(false)
    const [employeeRoles, setEmployeeRoles] = useState<string[]>([])

    // Agregar función para buscar empleado por DNI
    const findEmployeeByDni = (dni: string) => {
        // Simulamos empleados con DNI
        const employeesWithDni = [
        { id: "1", name: "Juan Pérez", email: "juan@example.com", dni: "12345678", roles: ["Administrador", "Editor"] },
        { id: "2", name: "María García", email: "maria@example.com", dni: "87654321", roles: ["Editor"] },
        { id: "3", name: "Carlos López", email: "carlos@example.com", dni: "11223344", roles: ["Viewer"] },
        {
            id: "4",
            name: "Ana Rodríguez",
            email: "ana@example.com",
            dni: "222",
            roles: ["Empleado", "Administrador Financiero"],
        },
        ]

        const employee = employeesWithDni.find((emp) => emp.dni === dni)
        if (employee) {
        setSelectedEmployee({
            id: employee.id,
            name: employee.name,
            email: employee.email,
            role: employee.roles[0], // rol principal
            status: "active",
        })
        setEmployeeRoles(employee.roles)
        } else {
        setSelectedEmployee(null)
        setEmployeeRoles([])
        }
    }

    // Función para desasignar rol
    const unassignRole = (roleToRemove: string) => {
        setEmployeeRoles((prev) => prev.filter((role) => role !== roleToRemove))
    }

    // Función para asignar nuevo rol
    const assignRole = (newRole: string) => {
        if (!employeeRoles.includes(newRole)) {
        setEmployeeRoles((prev) => [...prev, newRole])
        }
        setIsAssignRoleOpen(false)
    }

return (
    <div className="min-h-screen bg-gray-50">
        {/* Barra Superior del Administrador */}
        <BarraSuperior/>

        {/* Contenido Principal */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* Botón Administrar Roles de Usuario */}
                <Dialog open={isManageUsersOpen} onOpenChange={setIsManageUsersOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full h-24 text-lg flex flex-col items-center justify-center space-y-2"
                        >
                            <Users className="h-8 w-8" />
                            <span>Administrar Roles de Usuario</span>
                        </Button>
                        <ModalAdministrarRolesUsuario/>
                    </DialogTrigger>
                </Dialog>

                {/* Botón Crear, Modificar o Eliminar Rol */}
                <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
                    <DialogTrigger asChild>
                    <Button className="w-full h-24 text-lg flex flex-col items-center justify-center space-y-2">
                        <Settings className="h-8 w-8" />
                        <span>Crear, Modificar o Eliminar Rol</span>
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Gestión de Roles</DialogTitle>
                        <DialogDescription>
                        Crea nuevos roles, modifica los existentes o elimina roles del sistema
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="list" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="list">Lista de Roles</TabsTrigger>
                        <TabsTrigger value="create">Crear Nuevo Rol</TabsTrigger>
                        </TabsList>

                        <TabsContent value="list" className="space-y-4">
                        {roles.map((role) => (
                            <Card key={role.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">{role.name}</CardTitle>
                                    <CardDescription>{role.description}</CardDescription>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-2">
                                    {role.permissions.map((permission) => (
                                    <Badge key={permission} variant="secondary">
                                        {permission}
                                    </Badge>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">{role.userCount} usuarios</span>
                                </div>
                            </CardContent>
                            </Card>
                        ))}
                        </TabsContent>

                        <TabsContent value="create" className="space-y-4">
                        <Card>
                            <CardHeader>
                            <CardTitle>Crear Nuevo Rol</CardTitle>
                            <CardDescription>Define un nuevo rol con sus permisos correspondientes</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                <Label htmlFor="roleName">Nombre del Rol</Label>
                                <Input id="roleName" placeholder="Ej: Moderador" />
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="roleDescription">Descripción</Label>
                                <Input id="roleDescription" placeholder="Descripción del rol" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Permisos</Label>
                                <div className="grid grid-cols-2 gap-2">
                                {["read", "write", "delete", "admin", "moderate", "export"].map((permission) => (
                                    <div key={permission} className="flex items-center space-x-2">
                                    <input type="checkbox" id={permission} className="rounded" />
                                    <Label htmlFor={permission} className="capitalize">
                                        {permission}
                                    </Label>
                                    </div>
                                ))}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button variant="outline">Cancelar</Button>
                                <Button>Crear Rol</Button>
                            </div>
                            </CardContent>
                        </Card>
                        </TabsContent>
                    </Tabs>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
            <CardHeader>
                <CardTitle>Resumen de Roles</CardTitle>
                <CardDescription>Vista general de los roles y permisos del sistema</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {roles.map((role) => (
                    <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                        <Shield className="h-8 w-8 text-blue-600" />
                        <div>
                        <h3 className="font-medium">{role.name}</h3>
                        <p className="text-sm text-gray-500">{role.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                            </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                            +{role.permissions.length - 3}
                            </Badge>
                        )}
                        </div>
                        <span className="text-sm text-gray-500 min-w-fit">{role.userCount} usuarios</span>
                    </div>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>
        </main>
    </div>
  )
}
