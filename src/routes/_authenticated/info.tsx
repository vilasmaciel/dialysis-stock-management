import { createFileRoute } from '@tanstack/react-router'
import { Info, Phone, Clock, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/shared/components/ui/card'
import { CopyableEmail } from '#/shared/components/CopyableEmail'

export const Route = createFileRoute('/_authenticated/info')({
  component: InfoPage,
})

interface Contact {
  id: string
  title: string
  description?: string
  phones?: Array<{ number: string; label?: string }>
  emails?: string[]
  hours?: string
  highlight?: boolean
}

const CONTACTS: Contact[] = [
  {
    id: 'guardias',
    title: 'Guardias Palex',
    description: 'Todos los días (fines de semana y festivos incluidos)',
    phones: [{ number: '934006661', label: 'Gratuito' }],
    hours: '8:00 - 20:00h',
    highlight: true,
  },
  {
    id: 'hospital-enfermeria',
    title: 'Hospital Cunqueiro - Consulta Enfermería HD',
    description: 'Patricia - Enfermera responsable',
    phones: [{ number: '986217906' }],
    emails: ['hemo-domi.vigo@sergas.es'],
    hours: 'Lunes a viernes, 8:00 - 15:00h',
  },
  {
    id: 'hospital-sala',
    title: 'Hospital Cunqueiro - Sala de Hemodiálisis',
    phones: [
      { number: '986217902' },
      { number: '986811111', label: 'Centralita' },
    ],
    hours: 'L-V: 15:00-20:00h | Sábados: 8:00-20:00h',
  },
  {
    id: 'palex-candela',
    title: 'Palex - Candela',
    description: 'Enfermera zona / Servicio técnico',
    phones: [{ number: '620347988' }],
    emails: ['c.hermida@palex.es'],
  },
  {
    id: 'palex-alfonso',
    title: 'Palex - Alfonso',
    description: 'Pedidos de pacientes y alta nueva',
    phones: [{ number: '659140530' }],
    emails: ['a.arcas@palex.es'],
  },
  {
    id: 'pedidos',
    title: 'Pedidos de Material',
    phones: [{ number: '900180135' }],
    emails: ['hemodialisisencasa@palex.es'],
    highlight: true,
  },
]

function ContactCard({ contact }: { contact: Contact }) {
  return (
    <Card className={contact.highlight ? 'border-primary' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {contact.highlight && <Info className="h-5 w-5 text-primary" />}
          {contact.title}
        </CardTitle>
        {contact.description && (
          <CardDescription className="flex items-center gap-2">
            <User className="h-4 w-4 flex-shrink-0" />
            {contact.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Phones */}
        {contact.phones && contact.phones.length > 0 && (
          <div className="space-y-1.5">
            {contact.phones.map((phone, idx) => (
              <a
                key={idx}
                href={`tel:${phone.number.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors group"
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium group-hover:underline">{phone.number}</span>
                {phone.label && (
                  <span className="text-xs text-muted-foreground">({phone.label})</span>
                )}
              </a>
            ))}
          </div>
        )}

        {/* Emails */}
        {contact.emails && contact.emails.length > 0 && (
          <div className="space-y-1.5">
            {contact.emails.map((email) => (
              <CopyableEmail key={email} email={email} />
            ))}
          </div>
        )}

        {/* Hours */}
        {contact.hours && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground pt-2 border-t">
            <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{contact.hours}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function InfoPage() {
  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Info className="h-6 w-6" />
          Contactos e Información
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Información de contacto de Palex y Hospital Cunqueiro
        </p>
      </div>

      {/* Contacts Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {CONTACTS.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-6 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <Info className="h-4 w-4 flex-shrink-0" />
          <span>
            Haz click en los teléfonos para llamar directamente. Los emails se copian al
            portapapeles al hacer click.
          </span>
        </p>
      </div>
    </div>
  )
}
