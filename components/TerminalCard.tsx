import React from 'react'

interface TerminalCardProps {
  title?: string
  status?: 'success' | 'error' | 'warn' | 'info' | 'default'
  statusText?: string
  children: React.ReactNode
  className?: string
}

export default function TerminalCard({
  title,
  status = 'default',
  statusText,
  children,
  className = '',
}: TerminalCardProps) {
  const getStatusColors = () => {
    switch (status) {
      case 'success':
        return {
          border: 'border-terminal-primary/40 focus-within:border-terminal-primary',
          glow: '',
          text: 'text-terminal-primary glow-text-green',
          bg: 'bg-terminal-primary/[0.02]',
        }
      case 'error':
        return {
          border: 'border-terminal-error/40 focus-within:border-terminal-error',
          glow: 'glow-border-red',
          text: 'text-terminal-error glow-text-red',
          bg: 'bg-terminal-error/[0.02]',
        }
      case 'warn':
        return {
          border: 'border-terminal-warn/40 focus-within:border-terminal-warn',
          glow: '',
          text: 'text-terminal-warn glow-text-warn',
          bg: 'bg-terminal-warn/[0.02]',
        }
      case 'info':
        return {
          border: 'border-terminal-info/40 focus-within:border-terminal-info',
          glow: '',
          text: 'text-terminal-info',
          bg: 'bg-terminal-info/[0.02]',
        }
      default:
        return {
          border: 'border-terminal-border focus-within:border-terminal-primary',
          glow: '',
          text: 'text-terminal-primary/70',
          bg: 'bg-transparent',
        }
    }
  }

  const colors = getStatusColors()

  return (
    <div
      className={`border ${colors.border} ${colors.bg} ${colors.glow} p-4 relative mb-4 font-mono transition-all duration-300 ${className}`}
    >
      {/* Corner indicators for terminal feel */}
      <div className="absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t border-l border-current"></div>
      <div className="absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t border-r border-current"></div>
      <div className="absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 border-b border-l border-current"></div>
      <div className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b border-r border-current"></div>

      {/* Header bar */}
      {(title || statusText) && (
        <div className="flex justify-between items-center border-b border-inherit pb-2 mb-3 text-xs tracking-wider">
          {title && (
            <span className={`font-bold flex items-center gap-1.5 ${colors.text}`}>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
              {title.toUpperCase()}
            </span>
          )}
          {statusText && (
            <span className={`px-1.5 py-0.5 border border-inherit text-[10px] ${colors.text}`}>
              {statusText.toUpperCase()}
            </span>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}
