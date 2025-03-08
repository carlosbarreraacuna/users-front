"use client"

import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Tareas() {
  const [tareas, setTareas] = useState([])
  const [nuevaTarea, setNuevaTarea] = useState({
    titulo: "",
    descripcion: "",
    fecha_limite: "",
    persona: "",
  })
  const [tareaEditando, setTareaEditando] = useState(null)
  const [modalEditar, setModalEditar] = useState(false)
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)
  const [filtros, setFiltros] = useState({ fecha_limite: "", persona: "" })

  useEffect(() => {
    obtenerTareas()
  }, [])

  const obtenerTareas = async (filtros = {}) => {
    try {
      let url = "http://localhost:8000/api/tareas/"
      if (filtros.fecha_limite) url += `?fecha_limite=${filtros.fecha_limite}`
      if (filtros.persona) {
        url += url.includes("?") ? `&persona=${filtros.persona}` : `?persona=${filtros.persona}`
      }

      const response = await fetch(url)
      const data = await response.json()
      // Ensure data is an array
      setTareas(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error al obtener tareas", error)
      setTareas([]) // Set to empty array on error
    }
  }

  const crearTarea = async () => {
    try {
      await fetch("http://localhost:8000/api/tareas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaTarea),
      })
      setNuevaTarea({ titulo: "", descripcion: "", fecha_limite: "", persona: "" })
      obtenerTareas()
    } catch (error) {
      console.error("Error al crear tarea", error)
    }
  }

  const actualizarTarea = async () => {
    try {
      await fetch(`http://localhost:8000/api/tareas/${tareaEditando.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tareaEditando),
      })
      setModalEditar(false)
      setTareaEditando(null)
      obtenerTareas()
    } catch (error) {
      console.error("Error al actualizar tarea", error)
    }
  }

  const eliminarTarea = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/tareas/${id}/`, {
        method: "DELETE",
      })
      setConfirmarEliminar(null)
      obtenerTareas()
    } catch (error) {
      console.error("Error al eliminar tarea", error)
    }
  }

  const abrirModalEditar = (tarea) => {
    setTareaEditando({ ...tarea })
    setModalEditar(true)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Tareas</h1>

      {/* Filtros */}
      <div className="flex mb-4 gap-2">
        <Input
          type="date"
          value={filtros.fecha_limite}
          onChange={(e) => setFiltros({ ...filtros, fecha_limite: e.target.value })}
          className="text-sm w-auto"
          placeholder="dd/mm/aaaa"
        />
        <Input
          type="text"
          value={filtros.persona}
          onChange={(e) => setFiltros({ ...filtros, persona: e.target.value })}
          className="text-sm flex-grow"
          placeholder="Filtrar por persona"
        />
        <Button onClick={() => obtenerTareas(filtros)} variant="secondary" className="whitespace-nowrap">
          Filtrar
        </Button>
      </div>

      {/* Formulario */}
      <div className="flex mb-6 gap-2 flex-wrap md:flex-nowrap">
        <Input
          type="text"
          placeholder="Título"
          value={nuevaTarea.titulo}
          onChange={(e) => setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })}
          className="text-sm flex-grow"
        />
        <Input
          type="text"
          placeholder="Descripción"
          value={nuevaTarea.descripcion}
          onChange={(e) => setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })}
          className="text-sm flex-grow"
        />
        <Input
          type="date"
          value={nuevaTarea.fecha_limite}
          onChange={(e) => setNuevaTarea({ ...nuevaTarea, fecha_limite: e.target.value })}
          className="text-sm w-auto"
        />
        <Input
          type="text"
          placeholder="ID Persona"
          value={nuevaTarea.persona}
          onChange={(e) => setNuevaTarea({ ...nuevaTarea, persona: e.target.value })}
          className="text-sm w-auto"
        />
        <Button onClick={crearTarea} variant="default" className="whitespace-nowrap">
          Agregar
        </Button>
      </div>

      {/* Tabla de tareas */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-3 text-left font-medium text-gray-500 text-sm">ID</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Título</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Descripción</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Fecha Límite</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Persona</th>
              <th className="p-3 text-center font-medium text-gray-500 text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(tareas) && tareas.length > 0 ? (
              tareas.map((tarea, index) => (
                <tr
                  key={tarea.id}
                  className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}
                >
                  <td className="p-3 text-sm">{tarea.id}</td>
                  <td className="p-3 text-sm">{tarea.titulo}</td>
                  <td className="p-3 text-sm">{tarea.descripcion}</td>
                  <td className="p-3 text-sm">{tarea.fecha_limite}</td>
                  <td className="p-3 text-sm">{tarea.persona}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <Button
                      onClick={() => abrirModalEditar(tarea)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => setConfirmarEliminar(tarea.id)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500 text-sm">
                  No hay tareas disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de edición */}
      <Dialog open={modalEditar} onOpenChange={setModalEditar}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Tarea</DialogTitle>
            <DialogDescription>Modifica los campos de la tarea y guarda los cambios.</DialogDescription>
          </DialogHeader>
          {tareaEditando && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={tareaEditando.titulo}
                  onChange={(e) => setTareaEditando({ ...tareaEditando, titulo: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={tareaEditando.descripcion}
                  onChange={(e) => setTareaEditando({ ...tareaEditando, descripcion: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fecha_limite">Fecha Límite</Label>
                <Input
                  id="fecha_limite"
                  type="date"
                  value={tareaEditando.fecha_limite}
                  onChange={(e) => setTareaEditando({ ...tareaEditando, fecha_limite: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="persona">ID Persona</Label>
                <Input
                  id="persona"
                  value={tareaEditando.persona}
                  onChange={(e) => setTareaEditando({ ...tareaEditando, persona: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalEditar(false)}>
              Cancelar
            </Button>
            <Button onClick={actualizarTarea}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={confirmarEliminar !== null} onOpenChange={() => setConfirmarEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la tarea.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => eliminarTarea(confirmarEliminar)}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

