'use client'

import type { ComponentProps } from 'react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@workspace/components/ui/collapsible'
import { cn } from '@workspace/ui/lib/utils'
import { BrainIcon, ChevronDownIcon } from 'lucide-react'
import { useControllableState } from 'radix-ui'
import { createContext, memo, use, useEffect, useState } from 'react'

import { Response } from './response'

interface ReasoningContextValue {
  duration: number
  isOpen: boolean
  isStreaming: boolean
  setIsOpen: (open: boolean) => void
}

const ReasoningContext = createContext<null | ReasoningContextValue>(null),
  useReasoning = () => {
    const context = use(ReasoningContext)
    if (!context) throw new Error('Reasoning components must be used within Reasoning')

    return context
  }

export type ReasoningProps = ComponentProps<typeof Collapsible> & {
  defaultOpen?: boolean
  duration?: number
  isStreaming?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

const AUTO_CLOSE_DELAY = 1000,
  MS_IN_S = 1000

export const Reasoning = memo(
  ({
    children,
    className,
    defaultOpen = true,
    duration: durationProp,
    isStreaming = false,
    onOpenChange,
    open,
    ...props
  }: ReasoningProps) => {
    const [isOpen, setIsOpen] = useControllableState({
        defaultProp: defaultOpen,
        onChange: onOpenChange,
        prop: open
      }),
      [duration, setDuration] = useControllableState({
        defaultProp: 0,
        prop: durationProp
      }),
      [hasAutoClosed, setHasAutoClosed] = useState(false),
      [startTime, setStartTime] = useState<null | number>(null)

    // Track duration when streaming starts and ends
    useEffect(() => {
      if (isStreaming) {
        if (startTime === null) setStartTime(Date.now())
      } else if (startTime !== null) {
        setDuration(Math.ceil((Date.now() - startTime) / MS_IN_S))
        setStartTime(null)
      }
    }, [isStreaming, startTime, setDuration])

    // Auto-open when streaming starts, auto-close when streaming ends (once only)
    useEffect(() => {
      if (defaultOpen && !isStreaming && isOpen && !hasAutoClosed) {
        // Add a small delay before closing to allow user to see the content
        const timer = setTimeout(() => {
          setIsOpen(false)
          setHasAutoClosed(true)
        }, AUTO_CLOSE_DELAY)

        return () => clearTimeout(timer)
      }
    }, [isStreaming, isOpen, defaultOpen, setIsOpen, hasAutoClosed])

    const handleOpenChange = (newOpen: boolean) => {
      setIsOpen(newOpen)
    }

    return (
      <ReasoningContext value={{ duration, isOpen, isStreaming, setIsOpen }}>
        <Collapsible className={cn('not-prose mb-4', className)} onOpenChange={handleOpenChange} open={isOpen} {...props}>
          {children}
        </Collapsible>
      </ReasoningContext>
    )
  }
)

export type ReasoningTriggerProps = ComponentProps<typeof CollapsibleTrigger>

const getThinkingMessage = (isStreaming: boolean, duration?: number) => {
  if (isStreaming || duration === 0) return <p>Thinking...</p>

  if (duration === undefined) return <p>Thought for a few seconds</p>

  return <p>Thought for {duration} seconds</p>
}

export const ReasoningTrigger = memo(({ children, className, ...props }: ReasoningTriggerProps) => {
  const { duration, isOpen, isStreaming } = useReasoning()

  return (
    <CollapsibleTrigger
      className={cn(
        'flex w-full items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground',
        className
      )}
      {...props}>
      {children ?? (
        <>
          <BrainIcon className='size-4' />
          {getThinkingMessage(isStreaming, duration)}
          <ChevronDownIcon className={cn('size-4 transition-transform', isOpen ? 'rotate-180' : 'rotate-0')} />
        </>
      )}
    </CollapsibleTrigger>
  )
})

export type ReasoningContentProps = ComponentProps<typeof CollapsibleContent> & {
  children: string
}

export const ReasoningContent = memo(({ children, className, ...props }: ReasoningContentProps) => (
  <CollapsibleContent
    className={cn(
      'mt-4 text-sm',
      'text-muted-foreground outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2',
      className
    )}
    {...props}>
    <Response className='grid gap-2'>{children}</Response>
  </CollapsibleContent>
))

Reasoning.displayName = 'Reasoning'
ReasoningTrigger.displayName = 'ReasoningTrigger'
ReasoningContent.displayName = 'ReasoningContent'
