import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegistroPersona from "@/app/componentes/registro-persona";
import TablaPersonas from "@/app/componentes/tabla-personas";
import Tareas from "@/app/componentes/tareas"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Sistema de Registro</h1>

      <Tabs defaultValue="registro" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="registro">Registro de Persona</TabsTrigger>
          <TabsTrigger value="tabla">Personas Registradas</TabsTrigger>
          <TabsTrigger value="tareas">Tareas Asignadas</TabsTrigger>
        </TabsList>

        <TabsContent value="registro">
          <RegistroPersona />
        </TabsContent>

        <TabsContent value="tabla">
          <TablaPersonas />
        </TabsContent>

        <TabsContent value="tareas">
          <Tareas />
        </TabsContent>
      </Tabs>
    </main>
  )
}

