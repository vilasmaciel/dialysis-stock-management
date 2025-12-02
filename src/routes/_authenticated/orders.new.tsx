import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ShoppingCart, Loader2, Package, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { useMaterials } from '#/features/inventory/hooks/useMaterials'
import { useGmailAuth } from '#/features/orders/hooks/useGmailAuth'
import { useGmailSend } from '#/features/orders/hooks/useGmailSend'
import { useUserProfile } from '#/shared/hooks/useUserProfile'
import { useSetting } from '#/shared/hooks/useSettings'
import { exportToExcel } from '#/features/orders/utils/excelExport'
import { OrderItemCard } from '#/features/orders/components/OrderItemCard'
import { GmailPermissionDialog } from '#/features/orders/components/GmailPermissionDialog'
import { OrderPreviewDialog } from '#/features/orders/components/OrderPreviewDialog'
import { OrderErrorDialog } from '#/features/orders/components/OrderErrorDialog'
import { PageHeader } from '#/shared/components/PageHeader'
import { Button } from '#/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/shared/components/ui/card'
import { useAuth } from '#/shared/contexts/AuthContext'
import type { OrderItem, MaterialWithStats } from '#/shared/types'

export const Route = createFileRoute('/_authenticated/orders/new')({
  component: NewOrderPage,
})

/**
 * Calculates the initial number of boxes to order for a material
 */
function calculateInitialBoxes(material: MaterialWithStats): number {
  if (!material.itemsPerBox) {
    return material.unitsToOrder
  }
  return material.boxesToOrder || Math.ceil(material.unitsToOrder / material.itemsPerBox)
}

function NewOrderPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Fetch data
  const { data: materials, isLoading: materialsLoading } = useMaterials()
  const { data: userProfile } = useUserProfile(user?.id)
  const { data: recipientEmail } = useSetting('order_recipient_email')
  const { data: ccEmails } = useSetting('order_cc_emails')

  // Gmail hooks
  const { hasPermissions, isLoading: isCheckingGmail, signIn: connectGmail } = useGmailAuth()
  const gmailSendMutation = useGmailSend()

  // State
  const [orderQuantities, setOrderQuantities] = useState<Map<string, number>>(new Map())
  const [showPermissionDialog, setShowPermissionDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [sendError, setSendError] = useState<string>('')
  const [currentOrderNumber, setCurrentOrderNumber] = useState('')

  // Filter materials that need order - separate by hospital pickup
  const materialsToOrder = materials?.filter((m) => m.needsOrder && !m.hospitalPickup) || []
  const hospitalPickupMaterials = materials?.filter((m) => m.needsOrder && m.hospitalPickup) || []

  // Auto-initialize with calculated quantities for materials that need orders
  useEffect(() => {
    if (orderQuantities.size === 0 && materialsToOrder.length > 0) {
      const initialQuantities = new Map<string, number>()
      materialsToOrder.forEach((material) => {
        initialQuantities.set(material.id, calculateInitialBoxes(material))
      })
      setOrderQuantities(initialQuantities)
    }
  }, [materialsToOrder, orderQuantities.size])

  if (materialsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mb-2 mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando materiales...</p>
        </div>
      </div>
    )
  }

  // Selected items are those with quantity > 0
  const selectedItems = materialsToOrder.filter(
    (m) => orderQuantities.has(m.id) && (orderQuantities.get(m.id) || 0) > 0
  )

  const handleToggleMaterial = (materialId: string) => {
    const newQuantities = new Map(orderQuantities)
    if (newQuantities.has(materialId) && (newQuantities.get(materialId) || 0) > 0) {
      // Deselect: set quantity to 0
      newQuantities.set(materialId, 0)
    } else {
      // Select: set to initial calculated quantity
      const material = materialsToOrder.find((m) => m.id === materialId)
      if (material) {
        newQuantities.set(materialId, calculateInitialBoxes(material))
      }
    }
    setOrderQuantities(newQuantities)
  }

  const handleQuantityChange = (materialId: string, boxes: number) => {
    const newQuantities = new Map(orderQuantities)
    newQuantities.set(materialId, Math.max(0, boxes))
    setOrderQuantities(newQuantities)
  }

  const handleSelectAll = () => {
    const newQuantities = new Map<string, number>()
    materialsToOrder.forEach((material) => {
      newQuantities.set(material.id, calculateInitialBoxes(material))
    })
    setOrderQuantities(newQuantities)
  }

  const handleClearSelection = () => {
    setOrderQuantities(new Map())
  }

  const handleSendEmail = () => {
    // Check if user profile is complete
    const missingFields: string[] = []
    if (!userProfile?.fullName) missingFields.push('Nombre completo')
    if (!userProfile?.phone) missingFields.push('Teléfono')
    if (!userProfile?.address) missingFields.push('Dirección')

    if (missingFields.length > 0) {
      alert(
        `Por favor completa los siguientes campos en Configuración (pestaña "Perfil y Emails"):\n\n` +
        missingFields.map(field => `• ${field}`).join('\n')
      )
      navigate({ to: '/settings' })
      return
    }

    // Check if recipient email is configured
    if (!recipientEmail) {
      alert(
        'Por favor configura el "Email del destinatario" en Configuración (pestaña "Perfil y Emails").\n\n' +
        'Este es el email donde se enviarán los pedidos.'
      )
      navigate({ to: '/settings' })
      return
    }

    // Check Gmail connection
    if (!hasPermissions) {
      setShowPermissionDialog(true)
      return
    }

    // Show preview dialog
    setShowPreviewDialog(true)
  }

  const handleConnectGmail = async () => {
    try {
      console.log('[Orders] Starting Gmail connection...')
      await connectGmail()
      console.log('[Orders] Gmail connection successful')
      setShowPermissionDialog(false)
      setShowPreviewDialog(true)
    } catch (error) {
      console.error('[Orders] Gmail connection failed:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      alert(`No se pudo conectar con Gmail:\n\n${errorMessage}\n\nRevisa la consola para más detalles.`)
    }
  }

  const handleDownloadOnly = () => {
    setShowPermissionDialog(false)
    handleDownloadExcel()
  }

  const buildOrderItems = (): OrderItem[] => {
    if (!materialsToOrder) return []

    // Convert boxes to units
    return Array.from(orderQuantities.entries())
      .filter(([_, boxes]) => boxes > 0)
      .map(([materialId, boxes]) => {
        const material = materialsToOrder.find((m) => m.id === materialId)!
        const units = material.itemsPerBox ? boxes * material.itemsPerBox : boxes
        return {
          materialId,
          code: material.code,
          uv: material.itemsPerBox?.toString() || '',
          description: material.description || material.name,
          quantity: units, // Units, not boxes
          unit: material.unit,
        }
      })
  }

  const generateEmailMessage = (): string => {
    if (!userProfile) return ''

    return `Estimados,

Por favor, necesito realizar el siguiente pedido de materiales de diálisis.

Datos de contacto:
${userProfile.fullName}
${userProfile.phone}
${userProfile.address}

Adjunto encontrarán el detalle del pedido en formato Excel.

Saludos cordiales,
${userProfile.fullName}`
  }

  const handleConfirmSend = async (emailMessage: string) => {
    if (!materialsToOrder || selectedItems.length === 0) return

    const orderItems = buildOrderItems()
    const orderNumber = `PED-${Date.now()}`
    setCurrentOrderNumber(orderNumber)

    // Create Excel attachment
    const excelBlob = exportToExcel({
      orderNumber,
      items: orderItems,
      returnBlob: true,
    }) as Blob

    const filename = `pedido_${orderNumber}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`

    // recipientEmail is a string according to SettingValueMap
    const recipientEmailStr = recipientEmail || ''

    // ccEmails is a string[] according to SettingValueMap
    const ccEmailsArray = ccEmails || []

    try {
      await gmailSendMutation.mutateAsync({
        to: recipientEmailStr,
        cc: ccEmailsArray,
        subject: `Pedido de Materiales - ${orderNumber}`,
        body: emailMessage,
        attachment: excelBlob,
        attachmentFilename: filename,
      })

      // Success
      setShowPreviewDialog(false)
      navigate({ to: '/orders' })
    } catch (error) {
      // Error
      setSendError(error instanceof Error ? error.message : 'Error desconocido')
      setShowPreviewDialog(false)
      setShowErrorDialog(true)
    }
  }

  const handleDownloadExcel = () => {
    if (!materialsToOrder || selectedItems.length === 0) return

    const orderItems = buildOrderItems()
    const orderNumber = `PED-${Date.now()}`
    exportToExcel({ orderNumber, items: orderItems })

    // Navigate back
    navigate({ to: '/orders' })
  }

  const selectedCount = selectedItems.length

  // For OrderPreviewDialog props
  const recipientEmailStr = recipientEmail || ''
  const ccEmailsArray = ccEmails || []

  const orderNumber = currentOrderNumber || `PED-${Date.now()}`
  const filename = `pedido_${orderNumber}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <PageHeader
        title="Nuevo Pedido"
        subtitle="Selecciona los materiales que necesitas pedir"
        icon={<ShoppingCart className="h-6 w-6" />}
        showBack={true}
        backTo="/orders"
      />

      {/* Material Selection */}
      {materialsToOrder.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6 text-primary" />
              Todo en orden
            </CardTitle>
            <CardDescription className="text-center">
              Todos los materiales tienen stock suficiente
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Package className="mb-4 mx-auto h-24 w-24 text-muted-foreground" />
            <p className="mb-4 text-muted-foreground">
              No hay materiales que necesiten ser pedidos en este momento
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 mb-6">
          {/* Summary - Mobile only */}
          <div className="mb-4 sm:hidden">
            <p className="text-sm text-muted-foreground text-center">
              {materialsToOrder.length} material{materialsToOrder.length !== 1 ? 'es' : ''} necesitan pedido
              {' • '}
              <span className="font-medium text-foreground">
                {selectedItems.length} seleccionado{selectedItems.length !== 1 ? 's' : ''}
              </span>
            </p>
          </div>

          {/* Header with buttons */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Materiales a Pedir</h2>
            <div className="hidden sm:flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Seleccionar todos
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearSelection}>
                Limpiar selección
              </Button>
            </div>
          </div>

          {/* Mobile buttons */}
          <div className="flex sm:hidden gap-2 mb-3">
            <Button variant="outline" size="sm" onClick={handleSelectAll} className="flex-1">
              Seleccionar todos
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearSelection} className="flex-1">
              Limpiar
            </Button>
          </div>

          {/* Material list with OrderItemCard */}
          <div className="space-y-3">
            {materialsToOrder.map((material) => (
              <OrderItemCard
                key={material.id}
                material={material}
                isSelected={(orderQuantities.get(material.id) || 0) > 0}
                quantity={orderQuantities.get(material.id) || 0}
                onToggle={() => handleToggleMaterial(material.id)}
                onQuantityChange={(boxes) => handleQuantityChange(material.id, boxes)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hospital Pickup Section */}
      {hospitalPickupMaterials.length > 0 && (
        <Card className="mb-6 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-base">Materiales de Recogida en Hospital</CardTitle>
            <CardDescription>
              Estos materiales se recogen directamente en el hospital y no se incluyen en el pedido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {hospitalPickupMaterials.map((material) => (
                <div key={material.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{material.name}</span>
                  <span className="text-muted-foreground">Código: {material.code}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3 sticky bottom-6">
        <Button variant="outline" onClick={() => navigate({ to: '/orders' })} className="flex-1">
          Cancelar
        </Button>
        <Button
          onClick={handleSendEmail}
          disabled={selectedCount === 0 || isCheckingGmail || gmailSendMutation.isPending}
          className="flex-1"
        >
          {gmailSendMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            `Enviar Email (${selectedCount})`
          )}
        </Button>
      </div>

      {/* Dialogs */}
      <GmailPermissionDialog
        open={showPermissionDialog}
        onOpenChange={setShowPermissionDialog}
        onConnectGmail={handleConnectGmail}
        onDownloadOnly={handleDownloadOnly}
        isLoading={isCheckingGmail}
      />

      <OrderPreviewDialog
        open={showPreviewDialog}
        onOpenChange={setShowPreviewDialog}
        onSend={handleConfirmSend}
        recipientEmail={recipientEmailStr}
        ccEmails={ccEmailsArray}
        subject={`Pedido de Materiales - ${orderNumber}`}
        defaultMessage={generateEmailMessage()}
        attachmentFilename={filename}
        isSending={gmailSendMutation.isPending}
      />

      <OrderErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        error={sendError}
        onRetry={() => {
          setShowErrorDialog(false)
          setShowPreviewDialog(true)
        }}
        onDownload={handleDownloadExcel}
        isRetrying={false}
      />
    </div>
  )
}
