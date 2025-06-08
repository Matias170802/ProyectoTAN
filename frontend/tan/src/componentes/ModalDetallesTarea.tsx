"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/componentes/ui/dialog"
import { Button } from "@/componentes/ui/button"
import { MapPin, Calendar, Clock, FileText } from "lucide-react"

export default function ModalDetallesTarea({ task, onClose }) {
    

return (
    <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{task.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                        <p className="font-medium text-sm">Ubicación</p>
                        <p>{task.location}</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                        <p className="font-medium text-sm">Fecha</p>
                        <p>{task.date.toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                        <p className="font-medium text-sm">Hora</p>
                        <p>{task.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <FileText className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                        <p className="font-medium text-sm">Descripción</p>
                        <p>{task.description}</p>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button onClick={onClose}>Cerrar</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)
}
