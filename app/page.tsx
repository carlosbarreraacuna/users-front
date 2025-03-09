"use client"

import { useState } from "react"
import RegistroPersona from "@/app/componentes/registro-persona"
import TablaPersonas from "@/app/componentes/tabla-personas"
import Tareas from "@/app/componentes/tareas"
import Image from 'next/image';
import { UserPlus, Users, ClipboardList, Menu, X, Search, Bell } from "lucide-react"

export default function Home() {
  const [activeItem, setActiveItem] = useState("registro")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Only keeping the requested menu items
  const menuItems = [
    { id: "registro", label: "Registro", icon: <UserPlus className="h-5 w-5" /> },
    { id: "tabla", label: "Personas", icon: <Users className="h-5 w-5" /> },
    { id: "tareas", label: "Tareas", icon: <ClipboardList className="h-5 w-5" /> },
  ]

  const renderContent = () => {
    switch (activeItem) {
      case "registro":
        return <RegistroPersona />
      case "tabla":
        return <TablaPersonas />
      case "tareas":
        return <Tareas />
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-2xl font-semibold">Seleccione una opción del menú</h2>
          </div>
        )
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-[#F8F7FF] relative">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <div
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 fixed md:static z-30 w-64 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out
        `}
      >
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="font-bold text-xl">PruebaTecnica</span>
          </div>
        </div>

        <nav className="px-3 py-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`flex items-center w-full px-3 py-2 text-left rounded-lg mb-1 transition-colors ${
                activeItem === item.id ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => {
                setActiveItem(item.id)
                if (window.innerWidth < 768) {
                  setSidebarOpen(false)
                }
              }}
            >
              <span className={`mr-3 ${activeItem === item.id ? "text-blue-600" : "text-gray-400"}`}>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto w-full">
        <header className="bg-white shadow-sm px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button className="md:hidden p-2 rounded-lg hover:bg-gray-50" onClick={toggleSidebar}>
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Sistema de Registro</h1>
                <p className="text-xs md:text-sm text-gray-500">
                  {new Date().toLocaleString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-48 md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>

              <button className="p-2 rounded-lg hover:bg-gray-50">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>

              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-200 overflow-hidden">
                  <Image src="/placeholder.svg?height=32&width=32" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="hidden md:flex gap-2 items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-sm font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">{renderContent()}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

