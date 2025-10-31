import { useState } from 'react'
import imageCompression from 'browser-image-compression'
import { supabase } from '#/shared/api/supabase'

interface UploadImageOptions {
  materialId: string
  file: File
  onProgress?: (progress: number) => void
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = async ({ materialId, file, onProgress }: UploadImageOptions): Promise<string | null> => {
    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // 1. Validar tamaño (5MB máximo antes de compresión)
      const maxSizeMB = 5
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`La imagen es demasiado grande. Máximo ${maxSizeMB}MB.`)
      }

      // 2. Validar tipo
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen.')
      }

      // 3. Optimizar imagen
      onProgress?.(10)
      setUploadProgress(10)

      const options = {
        maxSizeMB: 1, // Máximo 1MB después de compresión
        maxWidthOrHeight: 1024, // Máximo 1024px en cualquier dimensión
        useWebWorker: true,
        fileType: 'image/jpeg' as const, // Convertir todo a JPEG
        initialQuality: 0.8, // Calidad 80%
      }

      const compressedFile = await imageCompression(file, options)
      
      onProgress?.(40)
      setUploadProgress(40)

      // 4. Generar nombre único
      const fileExt = 'jpg' // Siempre JPG después de optimización
      const fileName = `${materialId}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // 5. Subir a Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('material')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: true, // Sobrescribir si ya existe
        })

      if (uploadError) {
        throw uploadError
      }

      onProgress?.(80)
      setUploadProgress(80)

      // 6. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('material')
        .getPublicUrl(data.path)

      onProgress?.(100)
      setUploadProgress(100)

      return publicUrl
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al subir la imagen'
      setError(message)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    try {
      // Extraer path del URL
      const url = new URL(imageUrl)
      const pathParts = url.pathname.split('/material/')
      if (pathParts.length < 2) {
        throw new Error('URL de imagen inválida')
      }
      const filePath = pathParts[1]

      const { error } = await supabase.storage
        .from('material')
        .remove([filePath])

      if (error) {
        throw error
      }

      return true
    } catch (err) {
      console.error('Error deleting image:', err)
      return false
    }
  }

  return {
    uploadImage,
    deleteImage,
    isUploading,
    uploadProgress,
    error,
  }
}

