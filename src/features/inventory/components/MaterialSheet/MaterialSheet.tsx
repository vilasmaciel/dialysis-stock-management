import { useState, useEffect } from 'react'
import { Loader2, Trash2, Package, AlertCircle } from 'lucide-react'
import type { Material } from '#/shared/types/material'
import { Button } from '#/shared/components/ui/button'
import { Input } from '#/shared/components/ui/input'
import { Label } from '#/shared/components/ui/label'
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

  // Reset image error when photoUrl changes
  useEffect(() => {
    setImageError(false)
  }, [photoUrl])

  return (
    <div className="grid gap-4 py-4 sm:grid-cols-2">
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

      {/* Name - Full width */}
      <div className="space-y-2 sm:col-span-2">
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

      {/* Description - Full width */}
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Información adicional"
        />
      </div>

      {/* Photo URL with preview */}
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="photo_url">URL de la imagen</Label>
        <div className="flex gap-3 items-start">
          <div className="flex-1">
            <Input
              id="photo_url"
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
          {/* Image preview */}
          <div className="flex-shrink-0">
            {photoUrl && !imageError ? (
              <img
                src={photoUrl}
                alt="Preview"
                className="h-16 w-16 rounded object-cover border"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded border bg-muted">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          URL de una imagen del material (opcional)
        </p>
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
      {!isEditing && (
        <div className="space-y-2 sm:col-span-2">
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
      )}
    </div>
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

