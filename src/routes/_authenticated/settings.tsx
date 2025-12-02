import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Loader2, AlertCircle, PackageX, Plus, Save } from 'lucide-react'
import { useMaterials } from '#/features/inventory/hooks/useMaterials'
import { useSetting, useUpdateSetting } from '#/shared/hooks/useSettings'
import { useUserProfile, useUpdateUserProfile } from '#/shared/hooks/useUserProfile'
import { useAuth } from '#/shared/contexts/AuthContext'
import { MaterialSheet } from '#/features/inventory/components/MaterialSheet/MaterialSheet'
import { MaterialSettingsRow } from '#/features/inventory/components/MaterialSettingsRow/MaterialSettingsRow'
import { PageHeader } from '#/shared/components/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/shared/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/shared/components/ui/card'
import { Button } from '#/shared/components/ui/button'
import { Input } from '#/shared/components/ui/input'
import { Label } from '#/shared/components/ui/label'
import { Separator } from '#/shared/components/ui/separator'
import { toast } from 'sonner'
import type { Material } from '#/shared/types/material'
import type { InventorySessionsConfig } from '#/shared/types/settings'

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | undefined>()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Auth context
  const { user } = useAuth()

  // Fetch data
  const { data: materials, isLoading: materialsLoading, error: materialsError } = useMaterials()
  const { data: sessionsConfig, isLoading: configLoading } = useSetting('inventory_sessions')
  const { data: userProfile } = useUserProfile(user?.id)
  const { data: recipientEmail } = useSetting('order_recipient_email')
  const { data: ccEmails } = useSetting('order_cc_emails')
  const { data: googleApiCreds } = useSetting('google_api_credentials')

  // Sessions config state
  const [minSessions, setMinSessions] = useState(sessionsConfig?.min_sessions?.toString() || '7')
  const [maxSessions, setMaxSessions] = useState(sessionsConfig?.max_sessions?.toString() || '20')

  // User profile state
  const [fullName, setFullName] = useState(userProfile?.fullName || '')
  const [phone, setPhone] = useState(userProfile?.phone || '')
  const [address, setAddress] = useState(userProfile?.address || '')

  // Email config state
  const [orderRecipient, setOrderRecipient] = useState(
    recipientEmail || 'hemodialisisencasa@palex.es'
  )
  const [orderCc, setOrderCc] = useState(
    (ccEmails || ['vilasmaciel@gmail.com']).join(', ')
  )

  // Google API credentials state
  const [googleClientId, setGoogleClientId] = useState('')
  const [googleApiKey, setGoogleApiKey] = useState('')

  // Update settings mutation
  const updateSetting = useUpdateSetting()
  const updateProfile = useUpdateUserProfile()

  // Update local state when data loads
  useEffect(() => {
    if (sessionsConfig) {
      setMinSessions(sessionsConfig.min_sessions.toString())
      setMaxSessions(sessionsConfig.max_sessions.toString())
    }
  }, [sessionsConfig])

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName || '')
      setPhone(userProfile.phone || '')
      setAddress(userProfile.address || '')
    }
  }, [userProfile])

  useEffect(() => {
    if (recipientEmail) setOrderRecipient(recipientEmail)
    if (ccEmails) setOrderCc(ccEmails.join(', '))
  }, [recipientEmail, ccEmails])

  useEffect(() => {
    if (googleApiCreds) {
      setGoogleClientId(googleApiCreds.client_id || '')
      setGoogleApiKey(googleApiCreds.api_key || '')
    }
  }, [googleApiCreds])

  const handleSaveConfig = async () => {
    try {
      // Save sessions config
      const config: InventorySessionsConfig = {
        min_sessions: Number.parseInt(minSessions),
        max_sessions: Number.parseInt(maxSessions),
      }

      await updateSetting.mutateAsync({
        key: 'inventory_sessions',
        value: config as any,
      })

      // Save user profile
      if (user?.id) {
        await updateProfile.mutateAsync({
          userId: user.id,
          profile: {
            fullName,
            phone,
            address,
          },
        })
      }

      // Save email settings
      await updateSetting.mutateAsync({
        key: 'order_recipient_email',
        value: orderRecipient as any,
      })

      await updateSetting.mutateAsync({
        key: 'order_cc_emails',
        value: orderCc.split(',').map((e) => e.trim()) as any,
      })

      // Save Google API credentials (only if provided)
      if (googleClientId.trim()) {
        await updateSetting.mutateAsync({
          key: 'google_api_credentials',
          value: {
            client_id: googleClientId.trim(),
            api_key: googleApiKey.trim() || undefined,
          } as any,
        })
      }

      toast.success('Configuración guardada correctamente')
    } catch (error) {
      toast.error('Error al guardar la configuración')
      console.error(error)
    }
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

                  <Separator className="my-4" />

                  {/* User Profile Section */}
                  <div className="space-y-2 pt-2">
                    <h3 className="text-lg font-semibold">Datos de Envío</h3>
                    <p className="text-sm text-muted-foreground">
                      Información que aparecerá en los emails de pedidos
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nombre completo</Label>
                      <Input
                        id="full_name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Isabel Maciel Estévez"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="615862442"
                      />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Calle Ceán 26, Nigrán. 36350, Pontevedra"
                      />
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Email Configuration Section */}
                  <div className="space-y-2 pt-2">
                    <h3 className="text-lg font-semibold">Configuración de Emails</h3>
                    <p className="text-sm text-muted-foreground">
                      Destinatarios para los pedidos enviados por email
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Recipient Email */}
                    <div className="space-y-2">
                      <Label htmlFor="order_recipient">Email destinatario principal</Label>
                      <Input
                        id="order_recipient"
                        type="email"
                        value={orderRecipient}
                        onChange={(e) => setOrderRecipient(e.target.value)}
                        placeholder="hemodialisisencasa@palex.es"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email principal donde se enviarán los pedidos
                      </p>
                    </div>

                    {/* CC Emails */}
                    <div className="space-y-2">
                      <Label htmlFor="order_cc">Emails en copia (CC)</Label>
                      <Input
                        id="order_cc"
                        type="text"
                        value={orderCc}
                        onChange={(e) => setOrderCc(e.target.value)}
                        placeholder="email1@example.com, email2@example.com"
                      />
                      <p className="text-xs text-muted-foreground">
                        Emails que recibirán copia de los pedidos (separados por comas)
                      </p>
                    </div>
                  </div>

                  {/* Google API Configuration Section */}
                  <Separator className="my-6" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Credenciales de Google API</h3>
                    <p className="text-sm text-muted-foreground">
                      Para enviar pedidos por Gmail automáticamente
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Google Client ID */}
                    <div className="space-y-2">
                      <Label htmlFor="google_client_id">Google Client ID</Label>
                      <Input
                        id="google_client_id"
                        type="text"
                        value={googleClientId}
                        onChange={(e) => setGoogleClientId(e.target.value)}
                        placeholder="123456789.apps.googleusercontent.com"
                      />
                      <p className="text-xs text-muted-foreground">
                        Client ID obtenido de Google Cloud Console
                      </p>
                    </div>

                    {/* Google API Key */}
                    <div className="space-y-2">
                      <Label htmlFor="google_api_key">Google API Key (opcional)</Label>
                      <Input
                        id="google_api_key"
                        type="text"
                        value={googleApiKey}
                        onChange={(e) => setGoogleApiKey(e.target.value)}
                        placeholder="AIza..."
                      />
                      <p className="text-xs text-muted-foreground">
                        API Key de Google Cloud Console (opcional, mejora el rendimiento)
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveConfig}
                    disabled={updateSetting.isPending || updateProfile.isPending}
                    className="w-full"
                  >
                    {(updateSetting.isPending || updateProfile.isPending) && (
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

