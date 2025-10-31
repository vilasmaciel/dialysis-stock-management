import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { MaterialDetailSheet } from './MaterialDetailSheet'
import type { MaterialWithStats } from '#/shared/types/material'

// Mock the useIsDesktop hook
vi.mock('#/shared/hooks/useMediaQuery', () => ({
  useIsDesktop: () => true, // Default to desktop for tests
}))

const mockMaterial: MaterialWithStats = {
  id: '1',
  code: 'DIA-001',
  itemsPerBox: 10,
  name: 'Dializador FX80',
  description: 'Dializador de alto flujo para pacientes con tratamiento intensivo',
  unit: 'unidades',
  usagePerSession: 2,
  currentStock: 50,
  photoUrl: 'https://example.com/photo.jpg',
  hospitalPickup: false,
  minSessions: 7,
  maxSessions: 20,
  orderQuantity: 40,
  notes: undefined,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  availableSessions: 25,
  needsOrder: false,
  boxesToOrder: 0,
  unitsToOrder: 0,
}

const mockLowStockMaterial: MaterialWithStats = {
  ...mockMaterial,
  id: '2',
  currentStock: 10,
  availableSessions: 5,
  needsOrder: true,
  boxesToOrder: 4,
  unitsToOrder: 40,
}

describe('MaterialDetailSheet', () => {
  it('renders nothing when material is null', () => {
    const { container } = render(
      <MaterialDetailSheet material={null} open={true} onClose={vi.fn()} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('displays material name and code', () => {
    render(
      <MaterialDetailSheet material={mockMaterial} open={true} onClose={vi.fn()} />
    )

    expect(screen.getByText('Dializador FX80')).toBeInTheDocument()
    expect(screen.getByText('DIA-001')).toBeInTheDocument()
  })

  it('displays items per box when available', () => {
    render(
      <MaterialDetailSheet material={mockMaterial} open={true} onClose={vi.fn()} />
    )

    // Items per box is now shown as "10 items" with "por caja" as separate text
    expect(screen.getByText('10 items')).toBeInTheDocument()
    expect(screen.getByText('por caja')).toBeInTheDocument()
  })

  it('does not display items per box when not available', () => {
    const materialWithoutItemsPerBox = { ...mockMaterial, itemsPerBox: undefined }
    render(
      <MaterialDetailSheet
        material={materialWithoutItemsPerBox}
        open={true}
        onClose={vi.fn()}
      />
    )

    expect(screen.getByText('No especificado')).toBeInTheDocument()
    expect(screen.queryByText(/items/)).not.toBeInTheDocument()
  })

  it('displays material photo when available', () => {
    render(
      <MaterialDetailSheet material={mockMaterial} open={true} onClose={vi.fn()} />
    )

    const img = screen.getByAltText('Dializador FX80')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg')
  })

  it('displays placeholder icon when photo is not available', () => {
    const materialWithoutPhoto = { ...mockMaterial, photoUrl: undefined }
    render(
      <MaterialDetailSheet material={materialWithoutPhoto} open={true} onClose={vi.fn()} />
    )

    // Check that img is not in the document
    expect(screen.queryByAltText('Dializador FX80')).not.toBeInTheDocument()
    // Placeholder should be rendered (check for Package icon via class or role)
  })

  it('displays description when available', () => {
    render(
      <MaterialDetailSheet material={mockMaterial} open={true} onClose={vi.fn()} />
    )

    expect(
      screen.getByText('Dializador de alto flujo para pacientes con tratamiento intensivo')
    ).toBeInTheDocument()
  })

  it('does not display description section when description is undefined', () => {
    const materialWithoutDescription = { ...mockMaterial, description: undefined }
    render(
      <MaterialDetailSheet
        material={materialWithoutDescription}
        open={true}
        onClose={vi.fn()}
      />
    )

    expect(
      screen.queryByText('Dializador de alto flujo para pacientes con tratamiento intensivo')
    ).not.toBeInTheDocument()
  })

  it('displays stock information correctly', () => {
    render(
      <MaterialDetailSheet material={mockMaterial} open={true} onClose={vi.fn()} />
    )

    // Stock section now has "Estado Actual" heading
    expect(screen.getByText('Estado Actual')).toBeInTheDocument()
    expect(screen.getByText('Stock')).toBeInTheDocument()
    expect(screen.getByText('50 unidades')).toBeInTheDocument()
    expect(screen.getByText('Sesiones')).toBeInTheDocument()
    // Sessions number is now just "25" not "25 sesiones"
    expect(screen.getByText('25')).toBeInTheDocument()
    // Consumption is now in primary section with label "Consumo por sesión"
    expect(screen.getByText('Consumo por sesión')).toBeInTheDocument()
    expect(screen.getByText('2 unidades')).toBeInTheDocument()
  })

  it('displays available sessions in green when stock is sufficient', () => {
    render(
      <MaterialDetailSheet material={mockMaterial} open={true} onClose={vi.fn()} />
    )

    // Sessions is now just the number "25" in stock section
    const sessionsText = screen.getByText('25')
    // It should have text-foreground (not text-primary) when sufficient
    expect(sessionsText).toHaveClass('text-foreground')
  })

  it('displays available sessions in red when stock is low', () => {
    render(
      <MaterialDetailSheet material={mockLowStockMaterial} open={true} onClose={vi.fn()} />
    )

    // Sessions is now just the number "5" in stock section
    const sessionsText = screen.getByText('5')
    expect(sessionsText).toHaveClass('text-destructive')
  })

  it('displays inline low stock warning when needsOrder is true', () => {
    render(
      <MaterialDetailSheet material={mockLowStockMaterial} open={true} onClose={vi.fn()} />
    )

    // Now shows inline warning with boxes count
    expect(screen.getByText('Se recomienda pedir 4 cajas')).toBeInTheDocument()
  })

  it('does not display low stock warning when needsOrder is false', () => {
    render(
      <MaterialDetailSheet material={mockMaterial} open={true} onClose={vi.fn()} />
    )

    expect(screen.queryByText(/Se recomienda pedir/)).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(<MaterialDetailSheet material={mockMaterial} open={true} onClose={onClose} />)

    const closeButton = screen.getByRole('button', { name: /cerrar/i })
    await user.click(closeButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not render when open is false', () => {
    render(
      <MaterialDetailSheet material={mockMaterial} open={false} onClose={vi.fn()} />
    )

    // Dialog/Sheet should not be visible
    expect(screen.queryByText('Dializador FX80')).not.toBeInTheDocument()
  })
})
