import { useState, useCallback } from 'react'
import { MaterialWithStats } from '#/shared/types'

export interface ReviewItem {
  materialId: string
  materialName: string
  previousStock: number
  newStock: number
  reviewed: boolean
}

export function useReviewSession(materials: MaterialWithStats[]) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reviewedItems, setReviewedItems] = useState<ReviewItem[]>([])
  const [isComplete, setIsComplete] = useState(false)

  const currentMaterial = materials[currentIndex]
  const progress = ((currentIndex + 1) / materials.length) * 100
  const isLastItem = currentIndex === materials.length - 1

  const markAsReviewed = useCallback(
    (newStock: number) => {
      const reviewItem: ReviewItem = {
        materialId: currentMaterial.id,
        materialName: currentMaterial.name,
        previousStock: currentMaterial.currentStock,
        newStock,
        reviewed: true,
      }

      setReviewedItems((prev) => [...prev, reviewItem])

      if (isLastItem) {
        setIsComplete(true)
      } else {
        setCurrentIndex((prev) => prev + 1)
      }
    },
    [currentMaterial, isLastItem]
  )

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      // Remove last reviewed item
      setReviewedItems((prev) => prev.slice(0, -1))
    }
  }, [currentIndex])

  const reset = useCallback(() => {
    setCurrentIndex(0)
    setReviewedItems([])
    setIsComplete(false)
  }, [])

  return {
    currentMaterial,
    currentIndex,
    totalItems: materials.length,
    progress,
    isLastItem,
    isComplete,
    reviewedItems,
    markAsReviewed,
    goToPrevious,
    reset,
  }
}
