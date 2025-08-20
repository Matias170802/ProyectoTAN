
import { useState } from "react"
import { Button } from "@/generalComponents/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/generalComponents/ui/card"
import { Badge } from "@/generalComponents/ui/badge"
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger} from "@/generalComponents/ui/dialog"
import { Input } from "@/generalComponents/ui/input"
import { Label } from "@/generalComponents/ui/label"
import { Settings, Users, Edit, Trash2, Shield, UserCheck } from "lucide-react"


export default function ModalAdministrarRolesUsuario() {

<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Administrar Roles de Usuario</DialogTitle>
                            <DialogDescription>Busca un empleado por DNI para gestionar sus roles</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                            {/* Búsqueda por DNI */}
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                    <Label htmlFor="dni">DNI del Empleado</Label>
                                    <Input
                                        id="dni"
                                        placeholder="Ingrese el DNI del empleado"
                                        value={searchDni}
                                        onChange={(e) => setSearchDni(e.target.value)}
                                    />
                                    </div>
                                    <div className="flex items-end">
                                    <Button onClick={() => findEmployeeByDni(searchDni)}>Buscar</Button>
                                    </div>
                                </div>
                            </div>

                            {/* Información del empleado encontrado */}
                            {selectedEmployee && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <UserCheck className="h-5 w-5" />
                                            Empleado Encontrado
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                            <p className="text-sm text-gray-500">Nombre</p>
                                            <p className="font-medium">{selectedEmployee.name}</p>
                                            </div>
                                            <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{selectedEmployee.email}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Gestión de roles */}
                            {selectedEmployee && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">Roles Asignados</h3>

                                        {/* Botón Asignar Rol */}
                                        <Dialog open={isAssignRoleOpen} onOpenChange={setIsAssignRoleOpen}>
                                            <DialogTrigger asChild>
                                                <Button>
                                                    <Settings className="h-4 w-4 mr-2" />
                                                    Asignar Rol
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Asignar Nuevo Rol</DialogTitle>
                                                    <DialogDescription>
                                                        Selecciona un rol para asignar a {selectedEmployee.name}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <Label>Roles Disponibles</Label>
                                                    <div className="space-y-2">
                                                        {roles
                                                            .filter((role) => !employeeRoles.includes(role.name))
                                                            .map((role) => (
                                                            <div
                                                                key={role.id}
                                                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                                                onClick={() => assignRole(role.name)}
                                                            >
                                                                <div>
                                                                <p className="font-medium">{role.name}</p>
                                                                <p className="text-sm text-gray-500">{role.description}</p>
                                                                </div>
                                                                <Button size="sm">Asignar</Button>
                                                            </div>
                                                            ))}
                                                    </div>
                                                    {roles.filter((role) => !employeeRoles.includes(role.name)).length === 0 && (
                                                        <p className="text-center text-gray-500 py-4">No hay roles disponibles para asignar</p>
                                                    )}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    {/* Tabla de roles asignados */}
                                    <Card>
                                        <CardContent className="p-0">
                                            {employeeRoles.length > 0 ? (
                                                <div className="divide-y">
                                                    {employeeRoles.map((roleName, index) => {
                                                        const roleInfo = roles.find((r) => r.name === roleName)
                                                        return (
                                                            <div key={index} className="flex items-center justify-between p-4">
                                                                <div className="flex items-center space-x-4">
                                                                    <Shield className="h-5 w-5 text-blue-600" />
                                                                    <div>
                                                                        <p className="font-medium">{roleName}</p>
                                                                        <p className="text-sm text-gray-500">
                                                                            {roleInfo?.description || "Descripción no disponible"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {roleInfo?.permissions.slice(0, 3).map((permission) => (
                                                                            <Badge key={permission} variant="outline" className="text-xs">
                                                                            {permission}
                                                                            </Badge>
                                                                        ))}
                                                                        {roleInfo && roleInfo.permissions.length > 3 && (
                                                                            <Badge variant="outline" className="text-xs">
                                                                            +{roleInfo.permissions.length - 3}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                        onClick={() => unassignRole(roleName)}
                                                                        >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="p-8 text-center text-gray-500">
                                                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                                    <p>No hay roles asignados a este empleado</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Mensaje cuando no se encuentra empleado */}
                            {searchDni && !selectedEmployee && (
                                <Card>
                                    <CardContent className="p-8 text-center text-gray-500">
                                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>No se encontró ningún empleado con el DNI: {searchDni}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </DialogContent>
return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Administrar Roles de Usuario
            </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Administrar Roles de Usuario</DialogTitle>
                <DialogDescription>Busca un empleado por DNI para gestionar sus roles</DialogDescription>
            </DialogHeader>

            {/* Aquí iría el contenido del modal */}
        </DialogContent>
    </Dialog>
)
}