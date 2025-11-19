'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface SuccessModalProps {
  isOpen: boolean
  title: string
  message: string
  actionLabel?: string
  actionHref?: string
  onClose?: () => void
}

export default function SuccessModal({
  isOpen,
  title,
  message,
  actionLabel = 'View Dashboard',
  actionHref = '/app/dashboard',
  onClose,
}: SuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-card border-border max-w-md w-full p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-green-500/20">
            <CheckCircle size={48} className="text-green-400" />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold mb-3">{title}</h2>
        <p className="text-muted-foreground mb-8">{message}</p>

        {/* Action */}
        <Link href={actionHref} className="block">
          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
            {actionLabel}
            <ArrowRight size={18} />
          </Button>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="w-full mt-3 text-muted-foreground hover:text-foreground transition text-sm"
          >
            Dismiss
          </button>
        )}
      </Card>
    </div>
  )
}
