"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, Search } from "lucide-react"
import { InfoModal } from "@/app/componentes/modals"
import { EditModal } from "@/app/componentes/editmodal" // Corrected import

type Persona = {
  id: number
  tipo_documento: string
  numero_documento: string
  nombres: string
  apellidos: string
  correo: string
  telefono: string
  tipo_persona: string

}

export default function TablaPersonas() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [personaAEliminar, setPersonaAEliminar] = useState<number | null>(null)
  const [personaAEditar, setPersonaAEditar] = useState<Persona | null>(null) // Updated type
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/personas/`)
        if (!response.ok) {
          throw new Error("Error al obtener los datos")
        }
        const data = await response.json()
        setPersonas(data)
      } catch (error: unknown) { 
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError("Error desconocido")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPersonas()
  }, [])

  const handleBuscar = async () => {
    try {
      setLoading(true)
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/personas/`

      if (busqueda.trim() !== "") {
        url += `?numero_documento=${busqueda}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Error al obtener los datos")
      }

      const data = await response.json()
      setPersonas(data)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Error desconocido")
      }
    } finally {
      setLoading(false)
    }
  }

  const confirmarEliminar = (id: number) => {
    setPersonaAEliminar(id)
    setShowDeleteModal(true)
  }

  const eliminarPersona = async () => {
    if (personaAEliminar) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/personas/${personaAEliminar}/`, {
          method: "DELETE",
        })
        if (!response.ok) {
          throw new Error("Error al eliminar la persona")
        }
        setPersonas(personas.filter((p) => p.id !== personaAEliminar))
      }  catch (error) {
        if (error instanceof Error) {
          setError((error as Error).message)
        } else {
          setError("Error desconocido")
        }
      }  finally {
        setShowDeleteModal(false)
        setPersonaAEliminar(null)
      }
    }
  }

  const confirmarEditar = (persona: Persona) => { 
    setPersonaAEditar(persona)
    setShowEditModal(true)
  }

  const editarPersona = async (updatedPersona: Persona) => { 
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/personas/${updatedPersona.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPersona),
      })
      if (!response.ok) {
        throw new Error("Error al editar la persona")
      }
      setPersonas(personas.map((p) => (p.id === updatedPersona.id ? updatedPersona : p)))
    }  catch (error) {
      if (error instanceof Error) {
        setError((error as Error).message)
      } else {
        setError("Error desconocido")
      }
    }  finally {
      setShowEditModal(false)
      setPersonaAEditar(null)
    }
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Personas Registradas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-4 mb-6">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="busqueda">Buscar por número de documento</Label>
            <Input
              id="busqueda"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Ingrese número de documento"
            />
          </div>
          <Button onClick={handleBuscar}>
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo Documento</TableHead>
                <TableHead>Número Documento</TableHead>
                <TableHead>Nombres</TableHead>
                <TableHead>Apellidos</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {personas.length > 0 ? (
                personas.map((persona) => (
                  <TableRow key={persona.id}>
                    <TableCell>
                      {persona.tipo_documento === "CC"
                        ? "Cédula de Ciudadanía"
                        : persona.tipo_documento === "CE"
                          ? "Cédula de Extranjería"
                          : persona.tipo_documento === "TI"
                            ? "Tarjeta de Identidad"
                            : persona.tipo_documento === "PS"
                              ? "Pasaporte"
                              : persona.tipo_documento}
                    </TableCell>
                    <TableCell>{persona.numero_documento}</TableCell>
                    <TableCell>{persona.nombres}</TableCell>
                    <TableCell>{persona.apellidos}</TableCell>
                    <TableCell>{persona.correo}</TableCell>
                    <TableCell>{persona.telefono}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => confirmarEditar(persona)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => confirmarEliminar(persona.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No se encontraron resultados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <InfoModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          message="¿Está seguro que desea eliminar esta persona?"
          onConfirm={eliminarPersona}
        />

        {showEditModal && personaAEditar && (
          <EditModal
            persona={personaAEditar}
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSave={editarPersona}
          />
        )}
      </CardContent>
    </Card>
  )
}
