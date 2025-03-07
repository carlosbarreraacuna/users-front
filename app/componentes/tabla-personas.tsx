"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, Search } from "lucide-react"

// Datos de ejemplo
const personasIniciales = [
  {
    id: 1,
    tipoDocumento: "CC",
    numeroDocumento: "1234567890",
    nombres: "Juan Carlos",
    apellidos: "Pérez Gómez",
    fechaNacimiento: "1990-05-15",
    genero: "M",
    correo: "juan.perez@ejemplo.com",
    telefono: "3001234567",
  },
  {
    id: 2,
    tipoDocumento: "CE",
    numeroDocumento: "9876543210",
    nombres: "María José",
    apellidos: "López Rodríguez",
    fechaNacimiento: "1985-10-20",
    genero: "F",
    correo: "maria.lopez@ejemplo.com",
    telefono: "3109876543",
  },
  {
    id: 3,
    tipoDocumento: "TI",
    numeroDocumento: "1122334455",
    nombres: "Pedro Antonio",
    apellidos: "González Martínez",
    fechaNacimiento: "2000-03-25",
    genero: "M",
    correo: "pedro.gonzalez@ejemplo.com",
    telefono: "3201234567",
  },
]

export default function TablaPersonas() {
  const [personas, setPersonas] = useState(personasIniciales)
  const [busqueda, setBusqueda] = useState("")

  const handleBuscar = () => {
    if (busqueda.trim() === "") {
      setPersonas(personasIniciales)
      return
    }

    const resultados = personasIniciales.filter(
      (persona) =>
        persona.numeroDocumento.includes(busqueda) ||
        persona.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
        persona.apellidos.toLowerCase().includes(busqueda.toLowerCase()),
    )

    setPersonas(resultados)
  }

  const eliminarPersona = (id: number) => {
    setPersonas(personas.filter((p) => p.id !== id))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Personas Registradas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-4 mb-6">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="busqueda">Buscar por documento o nombre</Label>
            <Input
              id="busqueda"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Ingrese documento o nombre"
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
                <TableHead>Tipo Doc.</TableHead>
                <TableHead>Número</TableHead>
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
                    <TableCell>{persona.tipoDocumento}</TableCell>
                    <TableCell>{persona.numeroDocumento}</TableCell>
                    <TableCell>{persona.nombres}</TableCell>
                    <TableCell>{persona.apellidos}</TableCell>
                    <TableCell>{persona.correo}</TableCell>
                    <TableCell>{persona.telefono}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => eliminarPersona(persona.id)}>
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
      </CardContent>
    </Card>
  )
}
