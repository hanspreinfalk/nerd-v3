"use client"

import * as React from "react"
import { GalleryVerticalEnd, Plus, Search, MoreHorizontal, Edit2, Trash2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Flattened menu items data
const menuItems = [
  { id: 1, title: "Installation", url: "#" },
  { id: 2, title: "Project Structure", url: "#" },
  { id: 3, title: "Routing", url: "#" },
  { id: 4, title: "Data Fetching", url: "#", isActive: true },
  { id: 5, title: "Rendering", url: "#" },
  { id: 6, title: "Caching", url: "#" },
  { id: 7, title: "Styling", url: "#" },
  { id: 8, title: "Optimizing", url: "#" },
  { id: 9, title: "Configuring", url: "#" },
  { id: 10, title: "Testing", url: "#" },
  { id: 11, title: "Authentication", url: "#" },
  { id: 12, title: "Deploying", url: "#" },
  { id: 13, title: "Upgrading", url: "#" },
  { id: 14, title: "Examples", url: "#" },
  { id: 15, title: "Components", url: "#" },
  { id: 16, title: "File Conventions", url: "#" },
  { id: 17, title: "Functions", url: "#" },
  { id: 18, title: "next.config.js Options", url: "#" },
  { id: 19, title: "CLI", url: "#" },
  { id: 20, title: "Edge Runtime", url: "#" },
  { id: 21, title: "Accessibility", url: "#" },
  { id: 22, title: "Fast Refresh", url: "#" },
  { id: 23, title: "Next.js Compiler", url: "#" },
  { id: 24, title: "Supported Browsers", url: "#" },
  { id: 25, title: "Turbopack", url: "#" },
  { id: 26, title: "Contribution Guide", url: "#" },
]

export function AppSidebar({
  ...props
}) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [items, setItems] = React.useState(menuItems)
  const [editingId, setEditingId] = React.useState(null)
  const [editingTitle, setEditingTitle] = React.useState("")

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddNew = () => {
    const newItem = {
      id: Date.now(),
      title: "New Project",
      url: "#"
    }
    setItems([...items, newItem])
  }

  const handleEditItem = (id, currentTitle) => {
    setEditingId(id)
    setEditingTitle(currentTitle)
  }

  const handleSaveEdit = () => {
    if (editingTitle.trim()) {
      setItems(items.map(item =>
        item.id === editingId ? { ...item, title: editingTitle.trim() } : item
      ))
    }
    setEditingId(null)
    setEditingTitle("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingTitle("")
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const handleDeleteItem = (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader className="p-4 border-b">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Projects ({items.length})
            </h2>
          </div>
          <Button
            onClick={handleAddNew}
            className="w-full justify-start gap-2 bg-green-600 hover:bg-green-600 text-white"
            variant="default"
          >
            <Plus className="h-4 w-4" />
            New
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {filteredItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <div className="flex items-center justify-between w-full group">
                  {editingId === item.id ? (
                    <div className="flex-1 pr-2">
                      <Input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSaveEdit}
                        className="h-8 text-sm"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <SidebarMenuButton asChild isActive={item.isActive} className="flex-1">
                      <a href={item.url} className="flex items-center">
                        {item.title}
                      </a>
                    </SidebarMenuButton>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditItem(item.id, item.title)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit name
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
