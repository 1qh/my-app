'use client'

import type { ComponentProps, ReactNode } from 'react'

import { Button } from '@workspace/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@workspace/components/ui/collapsible'
import { Input } from '@workspace/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@workspace/components/ui/tooltip'
import { cn } from '@workspace/ui/lib/utils'
import { ChevronDownIcon } from 'lucide-react'
import { createContext, use, useEffect, useState } from 'react'

export interface WebPreviewContextValue {
  consoleOpen: boolean
  setConsoleOpen: (open: boolean) => void
  setUrl: (url: string) => void
  url: string
}

const WebPreviewContext = createContext<null | WebPreviewContextValue>(null),
  useWebPreview = () => {
    const context = use(WebPreviewContext)
    if (!context) throw new Error('WebPreview components must be used within a WebPreview')

    return context
  }

export type WebPreviewProps = ComponentProps<'div'> & {
  defaultUrl?: string
  onUrlChange?: (url: string) => void
}

export const WebPreview = ({ children, className, defaultUrl = '', onUrlChange, ...props }: WebPreviewProps) => {
  const [url, setUrl] = useState(defaultUrl),
    [consoleOpen, setConsoleOpen] = useState(false),
    handleUrlChange = (newUrl: string) => {
      setUrl(newUrl)
      onUrlChange?.(newUrl)
    },
    contextValue: WebPreviewContextValue = {
      consoleOpen,
      setConsoleOpen,
      setUrl: handleUrlChange,
      url
    }

  return (
    <WebPreviewContext value={contextValue}>
      <div className={cn('flex size-full flex-col rounded-lg border bg-card', className)} {...props}>
        {children}
      </div>
    </WebPreviewContext>
  )
}

export type WebPreviewNavigationProps = ComponentProps<'div'>

export const WebPreviewNavigation = ({ children, className, ...props }: WebPreviewNavigationProps) => (
  <div className={cn('flex items-center gap-1 border-b p-2', className)} {...props}>
    {children}
  </div>
)

export type WebPreviewNavigationButtonProps = ComponentProps<typeof Button> & {
  tooltip?: string
}

export const WebPreviewNavigationButton = ({
  children,
  disabled,
  onClick,
  tooltip,
  ...props
}: WebPreviewNavigationButtonProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className='size-8 p-0 hover:text-foreground'
          disabled={disabled}
          onClick={onClick}
          size='sm'
          variant='ghost'
          {...props}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export type WebPreviewUrlProps = ComponentProps<typeof Input>

export const WebPreviewUrl = ({ onChange, onKeyDown, value, ...props }: WebPreviewUrlProps) => {
  const { setUrl, url } = useWebPreview(),
    [inputValue, setInputValue] = useState(url)

  // Sync input value with context URL when it changes externally
  useEffect(() => {
    setInputValue(url)
  }, [url])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value)
      onChange?.(event)
    },
    handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        const target = event.target as HTMLInputElement
        setUrl(target.value)
      }
      onKeyDown?.(event)
    }

  return (
    <Input
      className='h-8 flex-1 text-sm'
      onChange={onChange ?? handleChange}
      onKeyDown={handleKeyDown}
      placeholder='Enter URL...'
      value={value ?? inputValue}
      {...props}
    />
  )
}

export type WebPreviewBodyProps = ComponentProps<'iframe'> & {
  loading?: ReactNode
}

export const WebPreviewBody = ({ className, loading, src, ...props }: WebPreviewBodyProps) => {
  const { url } = useWebPreview()

  return (
    <div className='flex-1'>
      <iframe
        className={cn('size-full', className)}
        sandbox='allow-scripts allow-same-origin allow-forms allow-popups allow-presentation'
        src={(src ?? url) || undefined}
        title='Preview'
        {...props}
      />
      {loading}
    </div>
  )
}

export type WebPreviewConsoleProps = ComponentProps<'div'> & {
  logs?: {
    level: 'error' | 'log' | 'warn'
    message: string
    timestamp: Date
  }[]
}

export const WebPreviewConsole = ({ children, className, logs = [], ...props }: WebPreviewConsoleProps) => {
  const { consoleOpen, setConsoleOpen } = useWebPreview()

  return (
    <Collapsible
      className={cn('border-t bg-muted/50 font-mono text-sm', className)}
      onOpenChange={setConsoleOpen}
      open={consoleOpen}
      {...props}>
      <CollapsibleTrigger asChild>
        <Button
          className='flex w-full items-center justify-between p-4 text-left font-medium hover:bg-muted/50'
          variant='ghost'>
          Console
          <ChevronDownIcon className={cn('size-4 transition-transform duration-200', consoleOpen && 'rotate-180')} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent
        className={cn(
          'px-4 pb-4',
          'outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95'
        )}>
        <div className='max-h-48 space-y-1 overflow-y-auto'>
          {logs.length === 0 ? (
            <p className='text-muted-foreground'>No console output</p>
          ) : (
            logs.map((log, index) => (
              <div
                className={cn(
                  'text-xs',
                  log.level === 'error' && 'text-destructive',
                  log.level === 'warn' && 'text-yellow-600',
                  log.level === 'log' && 'text-foreground'
                )}
                key={`${log.timestamp.getTime()}-${index}`}>
                <span className='text-muted-foreground'>{log.timestamp.toLocaleTimeString()}</span> {log.message}
              </div>
            ))
          )}
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
