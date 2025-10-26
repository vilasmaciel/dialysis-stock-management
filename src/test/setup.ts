import { afterAll, afterEach, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Setup MSW
import { setupServer } from 'msw/node'

export const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => {
  server.resetHandlers()
  cleanup()
})
