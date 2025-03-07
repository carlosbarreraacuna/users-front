import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegistroPersona from "@/app/componentes/registro-persona"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Sistema de Registro</h1>

      <Tabs defaultValue="registro" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="registro">Registro de Persona</TabsTrigger>
          <TabsTrigger value="tabla">Personas Registradas</TabsTrigger>
        </TabsList>

        <TabsContent value="registro">
          <RegistroPersona />
        </TabsContent>
      </Tabs>
    </main>
  )
}

