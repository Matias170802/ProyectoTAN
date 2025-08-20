"use client"

import type React from "react"

import { useState } from "react"
import { Camera, User } from "lucide-react"
import { Button } from "@/generalComponents/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/generalComponents/ui/card"
import { Input } from "@/generalComponents/ui/input"
import { Label } from "@/generalComponents/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/generalComponents/ui/tabs"
import { TopNavigation } from "@/componentes/dashboard/top-navigation"

export default function ProfileView() {
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [name, setName] = useState("Juan Pérez")
    const [email, setEmail] = useState("juan.perez@ejemplo.com")
    const [phone, setPhone] = useState("+54 11 1234-5678")

    /*const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
        if (e.target?.result) {
            setProfileImage(e.target.result as string)
        }
    }
    reader.readAsDataURL(file)
    }
    }*/

return (
    <div className="flex flex-col min-h-screen">
        <TopNavigation />

        <main className="flex-1 container mx-auto p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>

            <div className="max-w-3xl mx-auto">
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Información Personal</CardTitle>
                        <CardDescription>Actualice su información personal y de contacto</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex flex-col items-center">
                                <div className="relative mb-4">
                                    <div className="h-32 w-32 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                                        {profileImage ? (
                                        <img
                                            src={profileImage || "/placeholder.svg"}
                                            alt="Foto de perfil"
                                            className="h-full w-full object-cover"
                                        />
                                        ) : (
                                        <User className="h-16 w-16 text-muted-foreground" />
                                        )}
                                    </div>

                                    <Label
                                    htmlFor="profile-image"
                                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer"
                                    >
                                    <Camera className="h-4 w-4" />
                                    </Label>

                                    <Input
                                    id="profile-image"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    //onChange={handleImageChange}
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">Haga clic en el ícono de cámara para cambiar su foto</p>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre completo</Label>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo electrónico</Label>
                                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Número de teléfono</Label>
                                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="password">
                    <TabsList className="mb-4">
                        <TabsTrigger value="password">Cambiar Contraseña</TabsTrigger>
                        <TabsTrigger value="notifications">Preferencias de Notificaciones</TabsTrigger>
                    </TabsList>

                    <TabsContent value="password">
                        <Card>
                            <CardHeader>
                                <CardTitle>Cambiar Contraseña</CardTitle>
                                <CardDescription>Actualice su contraseña para mantener segura su cuenta</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Contraseña actual</Label>
                                    <Input id="current-password" type="password" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="new-password">Nueva contraseña</Label>
                                    <Input id="new-password" type="password" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                                    <Input id="confirm-password" type="password" />
                                </div>

                                <Button className="w-full">Actualizar Contraseña</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preferencias de Notificaciones</CardTitle>
                                <CardDescription>Configure cómo desea recibir notificaciones</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Notificaciones por correo electrónico</p>
                                        <p className="text-sm text-muted-foreground">Recibir notificaciones por correo electrónico</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor="email-notifications" className="sr-only">
                                        Notificaciones por correo electrónico
                                        </Label>
                                        <Input id="email-notifications" type="checkbox" className="h-4 w-4" defaultChecked />
                                    </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Notificaciones de tareas nuevas</p>
                                        <p className="text-sm text-muted-foreground">
                                        Recibir notificaciones cuando se le asigne una nueva tarea
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor="task-notifications" className="sr-only">
                                        Notificaciones de tareas nuevas
                                        </Label>
                                        <Input id="task-notifications" type="checkbox" className="h-4 w-4" defaultChecked />
                                    </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Notificaciones de transferencias</p>
                                        <p className="text-sm text-muted-foreground">
                                        Recibir notificaciones cuando reciba una transferencia
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor="transfer-notifications" className="sr-only">
                                        Notificaciones de transferencias
                                        </Label>
                                        <Input id="transfer-notifications" type="checkbox" className="h-4 w-4" defaultChecked />
                                    </div>
                                    </div>
                                </div>

                                <Button className="w-full mt-6">Guardar Preferencias</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    </div>
)
}

