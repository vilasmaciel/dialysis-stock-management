import { useState, useEffect } from 'react'
import { Loader2, Trash2, Package, AlertCircle, Camera } from 'lucide-react'
import type { Material } from '#/shared/types/material'
import { Button } from '#/shared/components/ui/button'
import { Input } from '#/shared/components/ui/input'
import { Label } from '#/shared/components/ui/label'
import { Textarea } from '#/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/shared/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/shared/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '#/shared/components/ui/sheet'
import { Alert, AlertDescription } from '#/shared/components/ui/alert'
import { useCreateMaterial, useUpdateMaterial, useDeleteMaterial } from '../../hooks/useMaterialMutations'
import { useIsDesktop } from '#/shared/hooks/useMediaQuery'

interface MaterialSheetProps {
  material?: Material
  open: boolean
  onClose: () => void
}

const UNIT_OPTIONS = [
  'bolsas',
  'cajas',
  'frascos',
  'paquetes',
  'pares',
  'rollos',
  'unidades',
]

// Form content component (shared between Dialog and Sheet)
interface MaterialFormContentProps {
  isEditing: boolean
  code: string
  setCode: (value: string) => void
  itemsPerBox: string
  setItemsPerBox: (value: string) => void
  name: string
  setName: (value: string) => void
  description: string
  setDescription: (value: string) => void
  photoUrl: string
  setPhotoUrl: (value: string) => void
  unit: string
  setUnit: (value: string) => void
  usagePerSession: string
  setUsagePerSession: (value: string) => void
  currentStock: string
  setCurrentStock: (value: string) => void
  material?: Material
}

function MaterialFormContent({
  isEditing,
  code,
  setCode,
  itemsPerBox,
  setItemsPerBox,
  name,
  setName,
  description,
  setDescription,
  photoUrl,
  setPhotoUrl,
  unit: _unit,
  setUnit,
  usagePerSession,
  setUsagePerSession,
  currentStock,
  setCurrentStock,
  material,
}: MaterialFormContentProps) {
  const [imageError, setImageError] = useState(false)
  const [previewImageError, setPreviewImageError] = useState(false)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [tempImageUrl, setTempImageUrl] = useState('')

  // Reset image error when photoUrl changes
  useEffect(() => {
    setImageError(false)
  }, [photoUrl])

  // Sync tempImageUrl with photoUrl when dialog opens
  useEffect(() => {
    if (isImageDialogOpen) {
      setTempImageUrl(photoUrl)
      setPreviewImageError(false)
    }
  }, [isImageDialogOpen, photoUrl])

  // Reset preview error when tempImageUrl changes
  useEffect(() => {
    setPreviewImageError(false)
  }, [tempImageUrl])

  const handleImageClick = () => {
    setIsImageDialogOpen(true)
  }

  const handleImageDialogSave = () => {
    setPhotoUrl(tempImageUrl.trim())
    setIsImageDialogOpen(false)
  }

  const handleImageDialogCancel = () => {
    setTempImageUrl(photoUrl)
    setIsImageDialogOpen(false)
  }

  return (
    <>
      {/* Image + Key Fields Section - Two columns on desktop */}
      <div className="grid sm:grid-cols-[160px_1fr] gap-4 sm:gap-6 py-4 border-b">
        {/* Clickable Image */}
        <div className="flex justify-center sm:justify-start">
          <div className="relative group cursor-pointer" onClick={handleImageClick}>
            {photoUrl && !imageError ? (
              <>
                <img
                  src={photoUrl}
                  alt="Material preview"
                  className="h-32 w-32 sm:h-40 sm:w-40 rounded-lg object-cover border-2 border-border transition-opacity group-hover:opacity-70"
                  loading="lazy"
                  onError={() => setImageError(true)}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </>
            ) : (
              <div className="flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted group-hover:bg-muted/80 transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <Camera className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors text-center px-2">
                    Click para agregar imagen
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Fields - Right side on desktop */}
        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej: Dializador FX80"
              required
            />
          </div>

          {/* Code */}
          <div className="space-y-2">
            <Label htmlFor="code">
              Código <span className="text-destructive">*</span>
            </Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ej: DIA-001"
              required
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 py-4 sm:grid-cols-2">
      {/* Items per box */}
      <div className="space-y-2">
        <Label htmlFor="itemsPerBox">Items por caja</Label>
        <Input
          id="itemsPerBox"
          type="number"
          value={itemsPerBox}
          onChange={(e) => setItemsPerBox(e.target.value)}
          placeholder="ej: 2, 10, 24"
          min="1"
          step="1"
        />
      </div>

      {/* Unit */}
      <div className="space-y-2">
        <Label htmlFor="unit">
          Unidad <span className="text-destructive">*</span>
        </Label>
        <Select key={`unit-select-${material?.id || 'new'}`} defaultValue={material?.unit || 'unidades'} onValueChange={setUnit}>
          <SelectTrigger id="unit">
            <SelectValue placeholder="Selecciona una unidad" />
          </SelectTrigger>
          <SelectContent>
            {UNIT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Usage per session */}
      <div className="space-y-2">
        <Label htmlFor="usage_per_session">
          Consumo por sesión <span className="text-destructive">*</span>
        </Label>
        <Input
          id="usage_per_session"
          type="number"
          step="0.01"
          min="0"
          value={usagePerSession}
          onChange={(e) => setUsagePerSession(e.target.value)}
          placeholder="1"
          required
        />
      </div>

      {/* Current stock (only when creating) */}
      {!isEditing ? (
        <div className="space-y-2">
          <Label htmlFor="current_stock">Stock inicial</Label>
          <Input
            id="current_stock"
            type="number"
            step="0.01"
            min="0"
            value={currentStock}
            onChange={(e) => setCurrentStock(e.target.value)}
            placeholder="0"
          />
        </div>
      ) : (
        <div></div>
      )}

      {/* Description - Full width, at the end */}
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Información adicional sobre el material..."
          rows={4}
          className="resize-none"
        />
      </div>
      </div>

      {/* Image URL Editor Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>URL de la imagen</DialogTitle>
            <DialogDescription>
              Ingresa la URL de una imagen del material (opcional)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="image_url_input">URL</Label>
              <Input
                id="image_url_input"
                type="url"
                value={tempImageUrl}
                onChange={(e) => setTempImageUrl(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleImageDialogSave()
                  }
                }}
              />
            </div>

            {/* Preview */}
            {tempImageUrl.trim() && (
              <div className="space-y-2">
                <Label>Vista previa</Label>
                <div className="flex justify-center">
                  {!previewImageError ? (
                    <img
                      src={tempImageUrl.trim()}
                      alt="Preview"
                      className="h-32 w-32 rounded-lg object-cover border"
                      loading="lazy"
                      onError={() => setPreviewImageError(true)}
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-lg border bg-muted">
                      <Package className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {previewImageError && (
                  <p className="text-xs text-destructive text-center">
                    No se pudo cargar la imagen. Verifica que la URL sea correcta.
                  </p>
                )}
              </div>
            )}

            {!tempImageUrl.trim() && (
              <div className="flex justify-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-lg border bg-muted">
                  <Package className="h-16 w-16 text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleImageDialogCancel}>
              Cancelar
            </Button>
            <Button onClick={handleImageDialogSave}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function MaterialSheet({ material, open, onClose }: MaterialSheetProps) {
  const isDesktop = useIsDesktop()
  const isEditing = !!material

  // Form state
  const [code, setCode] = useState('')
  const [itemsPerBox, setItemsPerBox] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [unit, setUnit] = useState('unidades')
  const [usagePerSession, setUsagePerSession] = useState('1')
  const [currentStock, setCurrentStock] = useState('0')

  // Sync form state with material prop
  useEffect(() => {
    if (material) {
      setCode(material.code)
      setItemsPerBox(material.itemsPerBox?.toString() || '')
      setName(material.name)
      setDescription(material.description || '')
      setPhotoUrl(material.photoUrl || '')
      setUnit(material.unit)
      setUsagePerSession(material.usagePerSession?.toString() || '1')
      setCurrentStock(material.currentStock?.toString() || '0')
    } else {
      // Reset to defaults when creating new material
      setCode('')
      setItemsPerBox('')
      setName('')
      setDescription('')
      setPhotoUrl('')
      setUnit('unidades')
      setUsagePerSession('1')
      setCurrentStock('0')
    }
  }, [material, open])

  // Delete confirmation dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Mutations
  const createMaterial = useCreateMaterial()
  const updateMaterial = useUpdateMaterial()
  const deleteMaterial = useDeleteMaterial()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const materialData = {
      code: code.trim(),
      uv: itemsPerBox.trim() ? Number.parseInt(itemsPerBox) : null,
      name: name.trim(),
      description: description.trim() || null,
      photo_url: photoUrl.trim() || null,
      unit,
      usage_per_session: Number.parseFloat(usagePerSession),
      current_stock: Number.parseFloat(currentStock),
    }

    try {
      if (isEditing) {
        await updateMaterial.mutateAsync({
          id: material.id,
          ...materialData,
        })
      } else {
        await createMaterial.mutateAsync(materialData)
      }
      handleClose()
    } catch (error) {
      console.error('Error saving material:', error)
    }
  }

  const handleDelete = async () => {
    if (!material) return

    // Clear previous errors
    setDeleteError(null)

    try {
      await deleteMaterial.mutateAsync(material.id)
      setShowDeleteDialog(false)
      handleClose()
    } catch (error) {
      console.error('Error deleting material:', error)
      // Set error message for display
      if (error instanceof Error) {
        setDeleteError(error.message)
      } else {
        setDeleteError('Error inesperado al eliminar el material')
      }
    }
  }

  const handleOpenDeleteDialog = () => {
    setDeleteError(null)
    setShowDeleteDialog(true)
  }

  const handleClose = () => {
    onClose()
  }

  const isValid =
    code.trim() &&
    name.trim() &&
    usagePerSession &&
    Number.parseFloat(usagePerSession) >= 0

  const isPending =
    createMaterial.isPending || updateMaterial.isPending || deleteMaterial.isPending

  // Form props for reusable content
  const formProps = {
    isEditing,
    code,
    setCode,
    itemsPerBox,
    setItemsPerBox,
    name,
    setName,
    description,
    setDescription,
    photoUrl,
    setPhotoUrl,
    unit,
    setUnit,
    usagePerSession,
    setUsagePerSession,
    currentStock,
    setCurrentStock,
    material,
  }

  // Desktop version: Dialog (centered modal)
  if (isDesktop) {
    return (
      <>
        <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Editar Material' : 'Añadir Material'}</DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? 'Modifica los datos del material'
                    : 'Completa la información del nuevo material'}
                </DialogDescription>
              </DialogHeader>

              <MaterialFormContent {...formProps} />

              <DialogFooter className="flex-col gap-2 sm:flex-row-reverse">
                <Button type="submit" disabled={!isValid || isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? 'Guardar cambios' : 'Crear material'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isPending}
                >
                  Cancelar
                </Button>

                {isEditing && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={handleOpenDeleteDialog}
                    disabled={isPending}
                    className="sm:mr-auto"
                    title="Eliminar material"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog (Desktop) */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Eliminar material?</DialogTitle>
              <DialogDescription>
                Esta acción no se puede deshacer. El material "{material?.name}" será eliminado
                permanentemente.
              </DialogDescription>
            </DialogHeader>

            {deleteError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{deleteError}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isPending}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Mobile version: Sheet (bottom drawer)
  return (
    <>
      <Sheet open={open} onOpenChange={(open) => !open && handleClose()}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <SheetHeader>
              <SheetTitle>{isEditing ? 'Editar Material' : 'Añadir Material'}</SheetTitle>
              <SheetDescription>
                {isEditing
                  ? 'Modifica los datos del material'
                  : 'Completa la información del nuevo material'}
              </SheetDescription>
            </SheetHeader>

            <MaterialFormContent {...formProps} />

            <SheetFooter className="flex flex-col gap-2 pt-4">
              <Button type="submit" disabled={!isValid || isPending} className="w-full">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Guardar cambios' : 'Crear material'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
                className="w-full"
              >
                Cancelar
              </Button>

              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleOpenDeleteDialog}
                  disabled={isPending}
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar material
                </Button>
              )}
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Sheet (Mobile) */}
      <Sheet open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>¿Eliminar material?</SheetTitle>
            <SheetDescription>
              Esta acción no se puede deshacer. El material "{material?.name}" será eliminado
              permanentemente.
            </SheetDescription>
          </SheetHeader>

          {deleteError && (
            <Alert variant="destructive" className="my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}

          <SheetFooter className="flex flex-col gap-2 pt-4">
            <Button variant="destructive" onClick={handleDelete} disabled={isPending} className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </Button>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isPending} className="w-full">
              Cancelar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}

