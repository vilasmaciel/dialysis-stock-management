import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Loader2, AlertCircle, PackageX, Plus, Save } from 'lucide-react'
import { useMaterials } from '#/features/inventory/hooks/useMaterials'
import { useSetting, useUpdateSetting } from '#/shared/hooks/useSettings'
import { MaterialSheet } from '#/features/inventory/components/MaterialSheet/MaterialSheet'
import { MaterialSettingsRow } from '#/features/inventory/components/MaterialSettingsRow/MaterialSettingsRow'
import { PageHeader } from '#/shared/components/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/shared/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/shared/components/ui/card'
import { Button } from '#/shared/components/ui/button'
import { Input } from '#/shared/components/ui/input'
import { Label } from '#/shared/components/ui/label'
import type { Material } from '#/shared/types/material'
import type { InventorySessionsConfig } from '#/shared/types/settings'

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | undefined>()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Fetch data
  const { data: materials, isLoading: materialsLoading, error: materialsError } = useMaterials()
  const { data: sessionsConfig, isLoading: configLoading } = useSetting('inventory_sessions')

  // Sessions config state
  const [minSessions, setMinSessions] = useState(sessionsConfig?.min_sessions?.toString() || '7')
  const [maxSessions, setMaxSessions] = useState(sessionsConfig?.max_sessions?.toString() || '20')

  // Update settings mutation
  const updateSetting = useUpdateSetting()

  // Update local state when data loads
  useEffect(() => {
    if (sessionsConfig) {
      setMinSessions(sessionsConfig.min_sessions.toString())
      setMaxSessions(sessionsConfig.max_sessions.toString())
    }
  }, [sessionsConfig])

  const handleSaveConfig = async () => {
    const config: InventorySessionsConfig = {
      min_sessions: Number.parseInt(minSessions),
      max_sessions: Number.parseInt(maxSessions),
    }

    await updateSetting.mutateAsync({
      key: 'inventory_sessions',
      value: config as any,
    })
  }

  const handleAddMaterial = () => {
    setSelectedMaterial(undefined)
    setIsSheetOpen(true)
  }

  const handleEditMaterial = (material: Material) => {
    setSelectedMaterial(material)
    setIsSheetOpen(true)
  }

  const handleCloseSheet = () => {
    setIsSheetOpen(false)
    setSelectedMaterial(undefined)
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <PageHeader
        title="Configuración"
        subtitle="Gestiona materiales y preferencias del sistema"
        icon={<SettingsIcon className="h-6 w-6" />}
        showBack={false}
      />

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="materials">Materiales</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Sesiones</CardTitle>
              <CardDescription>
                Define los umbrales de sesiones disponibles para alertas de inventario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {configLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  {/* Min Sessions */}
                  <div className="space-y-2">
                    <Label htmlFor="min_sessions">Sesiones mínimas</Label>
                    <Input
                      id="min_sessions"
                      type="number"
                      min="1"
                      value={minSessions}
                      onChange={(e) => setMinSessions(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Se mostrará alerta cuando las sesiones disponibles estén por debajo de este
                      valor
                    </p>
                  </div>

                  {/* Max Sessions */}
                  <div className="space-y-2">
                    <Label htmlFor="max_sessions">Sesiones máximas</Label>
                    <Input
                      id="max_sessions"
                      type="number"
                      min="1"
                      value={maxSessions}
                      onChange={(e) => setMaxSessions(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Objetivo de stock ideal para calcular cantidad a pedir
                    </p>
                  </div>

                  <Button
                    onClick={handleSaveConfig}
                    disabled={updateSetting.isPending}
                    className="w-full"
                  >
                    {updateSetting.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Save className="mr-2 h-4 w-4" />
                    Guardar configuración
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-4">
          {/* Add button */}
          <Button onClick={handleAddMaterial} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Añadir Material
          </Button>

          {/* Materials list */}
          {materialsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : materialsError ? (
            <div className="flex items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 p-6">
              <div className="text-center">
                <AlertCircle className="mb-2 mx-auto h-12 w-12 text-destructive" />
                <h3 className="mb-1 font-semibold text-destructive">Error al cargar materiales</h3>
                <p className="text-sm text-muted-foreground">
                  {materialsError.message || 'Ocurrió un error inesperado'}
                </p>
              </div>
            </div>
          ) : !materials || materials.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center">
                <PackageX className="mb-2 mx-auto h-16 w-16 text-muted-foreground" />
                <h3 className="mb-1 font-semibold">No hay materiales</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Añade tu primer material al catálogo
                </p>
                <Button onClick={handleAddMaterial}>
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Material
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {materials.map((material) => (
                <MaterialSettingsRow
                  key={material.id}
                  material={material}
                  onClick={() => handleEditMaterial(material)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Material Sheet */}
      <MaterialSheet material={selectedMaterial} open={isSheetOpen} onClose={handleCloseSheet} />
    </div>
  )
}

