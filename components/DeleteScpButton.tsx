'use client'

import React, { useTransition } from 'react'
import { deleteScpItem } from '@/app/actions/scp'
import { Trash2 } from 'lucide-react'

interface DeleteScpButtonProps {
  id: string
  itemNumber: string
}

export default function DeleteScpButton({ id, itemNumber }: DeleteScpButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (
      confirm(
        `WARNING: Are you sure you want to delete ${itemNumber} permanently? This action cannot be undone.`
      )
    ) {
      startTransition(async () => {
        const res = await deleteScpItem(id, itemNumber)
        if (res?.error) {
          alert(res.error)
        } else {
          window.location.href = '/' // Redirect to directory on success
        }
      })
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 text-xs border border-terminal-error hover:bg-terminal-error/10 px-3 py-1.5 text-terminal-error transition-all cursor-pointer disabled:opacity-50"
    >
      <Trash2 className="w-3.5 h-3.5" /> {isPending ? 'DELETING...' : 'DELETE RECORD'}
    </button>
  )
}
