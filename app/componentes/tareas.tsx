"use client"

import { useEffect, useState } from "react"
import { Pencil, Trash2, Filter, ChevronRight } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

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
  const [filtros, setFiltros] = useState({
    fecha_limite: "",
    fecha_inicio: "",
    fecha_fin: "",
    tipo_documento: "CC",
    numero_documento: "",
    tipoFiltro: "simple", // simple, rango, persona
  })
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(true)

  useEffect(() => {
    obtenerTareas()
  }, [])

  const obtenerTareas = async (filtrosParam = filtros) => {
    try {
      let url = "http://localhost:8000/api/tareas/"

      // Determinar qué tipo de filtro aplicar
      switch (filtrosParam.tipoFiltro) {
        case "rango":
          // Filtrar por rango de fechas
          if (filtrosParam.fecha_inicio && filtrosParam.fecha_fin) {
            url = `http://localhost:8000/api/tareas/por_rango_fechas/?fecha_inicio=${filtrosParam.fecha_inicio}&fecha_fin=${filtrosParam.fecha_fin}`
          }
          break

        case "persona":
          // Filtrar por persona (tipo y número de documento)
          if (filtrosParam.tipo_documento && filtrosParam.numero_documento) {
            url = `http://localhost:8000/api/tareas/por_persona/?tipo_documento=${filtrosParam.tipo_documento}&numero_documento=${filtrosParam.numero_documento}`
          }
          break

        case "simple":
        default:
          // Filtrar por fecha límite si está especificada
          if (filtrosParam.fecha_limite) {
            url += `?fecha_limite=${filtrosParam.fecha_limite}`
          }
          break
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

  const handleTabChange = (value) => {
    setFiltros({
      ...filtros,
      tipoFiltro: value,
    })
  }

  // Función para renderizar la vista móvil de una tarea
  const renderTareaMovil = (tarea, index) => (
    <Card key={tarea.id} className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium">{tarea.titulo}</h3>
            <p className="text-sm text-gray-500 mt-1">{tarea.descripcion}</p>
          </div>
          <div className="flex gap-1">
            <Button
              onClick={() => abrirModalEditar(tarea)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setConfirmarEliminar(tarea.id)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mt-3">
          <div>
            <span className="text-gray-500 block">Fecha límite:</span>
            <span>{tarea.fecha_limite}</span>
          </div>
          <div>
            <span className="text-gray-500 block">ID Persona:</span>
            <span>{tarea.persona}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Tipo documento:</span>
            <span>{tarea.persona_tipo_documento || "-"}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Número documento:</span>
            <span>{tarea.persona_numero_documento || "-"}</span>
          </div>
        </div>

        {tarea.completada ? (
          <Badge className="mt-3 bg-green-100 text-green-800 hover:bg-green-200">Completada</Badge>
        ) : (
          <Badge variant="outline" className="mt-3">
            Pendiente
          </Badge>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Gestión de Tareas</h1>

      {/* Filtros */}
      <Collapsible open={filtrosAbiertos} onOpenChange={setFiltrosAbiertos} className="mb-4 sm:mb-6">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="flex w-full justify-between mb-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filtros de búsqueda</span>
            </div>
            <ChevronRight className={`h-4 w-4 transition-transform ${filtrosAbiertos ? "rotate-90" : ""}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border rounded-lg p-3 sm:p-4 bg-gray-50">
            <Tabs defaultValue="simple" value={filtros.tipoFiltro} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="simple">Por fecha límite</TabsTrigger>
                <TabsTrigger value="rango">Por rango de fechas</TabsTrigger>
                <TabsTrigger value="persona">Por persona</TabsTrigger>
              </TabsList>

              <TabsContent value="simple" className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                  <div className="w-full sm:flex-1">
                    <Label htmlFor="fecha_limite" className="text-sm">
                      Fecha límite
                    </Label>
                    <Input
                      id="fecha_limite"
                      type="date"
                      value={filtros.fecha_limite}
                      onChange={(e) => setFiltros({ ...filtros, fecha_limite: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={() => obtenerTareas()} variant="secondary" className="w-full sm:w-auto">
                    Buscar
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="rango" className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                  <div className="w-full sm:flex-1">
                    <Label htmlFor="fecha_inicio" className="text-sm">
                      Fecha inicio
                    </Label>
                    <Input
                      id="fecha_inicio"
                      type="date"
                      value={filtros.fecha_inicio}
                      onChange={(e) => setFiltros({ ...filtros, fecha_inicio: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="w-full sm:flex-1">
                    <Label htmlFor="fecha_fin" className="text-sm">
                      Fecha fin
                    </Label>
                    <Input
                      id="fecha_fin"
                      type="date"
                      value={filtros.fecha_fin}
                      onChange={(e) => setFiltros({ ...filtros, fecha_fin: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    onClick={() => obtenerTareas()}
                    variant="secondary"
                    disabled={!filtros.fecha_inicio || !filtros.fecha_fin}
                    className="w-full sm:w-auto"
                  >
                    Buscar
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="persona" className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                  <div className="w-full sm:w-1/4">
                    <Label htmlFor="tipo_documento" className="text-sm">
                      Tipo documento
                    </Label>
                    <Select
                      value={filtros.tipo_documento}
                      onValueChange={(value) => setFiltros({ ...filtros, tipo_documento: value })}
                    >
                      <SelectTrigger id="tipo_documento" className="mt-1">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CC">CC</SelectItem>
                        <SelectItem value="TI">TI</SelectItem>
                        <SelectItem value="CE">CE</SelectItem>
                        <SelectItem value="PS">PS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:flex-1">
                    <Label htmlFor="numero_documento" className="text-sm">
                      Número documento
                    </Label>
                    <Input
                      id="numero_documento"
                      type="text"
                      value={filtros.numero_documento}
                      onChange={(e) => setFiltros({ ...filtros, numero_documento: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    onClick={() => obtenerTareas()}
                    variant="secondary"
                    disabled={!filtros.numero_documento}
                    className="w-full sm:w-auto"
                  >
                    Buscar
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Formulario */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row mb-4 sm:mb-6 gap-2">
        <Input
          type="text"
          placeholder="Título"
          value={nuevaTarea.titulo}
          onChange={(e) => setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })}
          className="text-sm"
        />
        <Input
          type="text"
          placeholder="Descripción"
          value={nuevaTarea.descripcion}
          onChange={(e) => setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })}
          className="text-sm"
        />
        <Input
          type="date"
          value={nuevaTarea.fecha_limite}
          onChange={(e) => setNuevaTarea({ ...nuevaTarea, fecha_limite: e.target.value })}
          className="text-sm"
        />
        <Input
          type="text"
          placeholder="ID Persona"
          value={nuevaTarea.persona}
          onChange={(e) => setNuevaTarea({ ...nuevaTarea, persona: e.target.value })}
          className="text-sm"
        />
        <Button onClick={crearTarea} variant="default" className="whitespace-nowrap w-full sm:w-auto">
          Agregar
        </Button>
      </div>

      {/* Vista móvil (cards) */}
      <div className="md:hidden">
        {Array.isArray(tareas) && tareas.length > 0 ? (
          tareas.map((tarea, index) => renderTareaMovil(tarea, index))
        ) : (
          <div className="text-center p-4 text-gray-500 text-sm border rounded-lg">No hay tareas disponibles</div>
        )}
      </div>

      {/* Vista desktop (tabla) */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-3 text-left font-medium text-gray-500 text-sm">ID</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Título</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Descripción</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Fecha Límite</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">ID Persona</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Tipo Doc.</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Número Doc.</th>
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
                  <td className="p-3 text-sm">{tarea.persona_tipo_documento || "-"}</td>
                  <td className="p-3 text-sm">{tarea.persona_numero_documento || "-"}</td>
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
                <td colSpan={8} className="p-4 text-center text-gray-500 text-sm">
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

