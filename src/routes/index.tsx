import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    // @ts-expect-error - context types will be added later
    if (context.auth?.session) {
      throw redirect({ to: '/dashboard' })
    } else {
      throw redirect({ to: '/login' })
    }
  },
})
