'use client'

import type { LanguageModelUsage } from 'ai'
import type { ComponentProps } from 'react'
import type { ModelId } from 'tokenlens'

import { Button } from '@workspace/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@workspace/components/ui/hover-card'
import { Progress } from '@workspace/components/ui/progress'
import { cn } from '@workspace/ui/lib/utils'
import { createContext, use } from 'react'
import { estimateCost } from 'tokenlens'

const PERCENT_MAX = 100,
  ICON_RADIUS = 10,
  ICON_VIEWBOX = 24,
  ICON_CENTER = 12,
  ICON_STROKE_WIDTH = 2

interface ContextSchema {
  maxTokens: number
  modelId?: ModelId
  usage?: LanguageModelUsage
  usedTokens: number
}

const ContextContext = createContext<ContextSchema | null>(null),
  useContextValue = () => {
    const context = use(ContextContext)

    if (!context) throw new Error('Context components must be used within Context')

    return context
  }

export type ContextProps = ComponentProps<typeof HoverCard> & ContextSchema

export const Context = ({ maxTokens, modelId, usage, usedTokens, ...props }: ContextProps) => (
  <ContextContext
    value={{
      maxTokens,
      modelId,
      usage,
      usedTokens
    }}>
    <HoverCard closeDelay={0} openDelay={0} {...props} />
  </ContextContext>
)

const ContextIcon = () => {
  const { maxTokens, usedTokens } = useContextValue(),
    circumference = 2 * Math.PI * ICON_RADIUS,
    usedPercent = usedTokens / maxTokens,
    dashOffset = circumference * (1 - usedPercent)

  return (
    <svg
      aria-label='Model context usage'
      height='20'
      role='img'
      style={{ color: 'currentcolor' }}
      viewBox={`0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`}
      width='20'>
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill='none'
        opacity='0.25'
        r={ICON_RADIUS}
        stroke='currentColor'
        strokeWidth={ICON_STROKE_WIDTH}
      />
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill='none'
        opacity='0.7'
        r={ICON_RADIUS}
        stroke='currentColor'
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap='round'
        strokeWidth={ICON_STROKE_WIDTH}
        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
      />
    </svg>
  )
}

export type ContextTriggerProps = ComponentProps<typeof Button>

export const ContextTrigger = ({ children, ...props }: ContextTriggerProps) => {
  const { maxTokens, usedTokens } = useContextValue(),
    usedPercent = usedTokens / maxTokens,
    renderedPercent = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 1,
      style: 'percent'
    }).format(usedPercent)

  return (
    <HoverCardTrigger asChild>
      {children ?? (
        <Button type='button' variant='ghost' {...props}>
          <span className='font-medium text-muted-foreground'>{renderedPercent}</span>
          <ContextIcon />
        </Button>
      )}
    </HoverCardTrigger>
  )
}

export type ContextContentProps = ComponentProps<typeof HoverCardContent>

export const ContextContent = ({ className, ...props }: ContextContentProps) => (
  <HoverCardContent className={cn('min-w-[240px] divide-y overflow-hidden p-0', className)} {...props} />
)

export type ContextContentHeader = ComponentProps<'div'>

export const ContextContentHeader = ({ children, className, ...props }: ContextContentHeader) => {
  const { maxTokens, usedTokens } = useContextValue(),
    usedPercent = usedTokens / maxTokens,
    displayPct = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 1,
      style: 'percent'
    }).format(usedPercent),
    used = new Intl.NumberFormat('en-US', {
      notation: 'compact'
    }).format(usedTokens),
    total = new Intl.NumberFormat('en-US', {
      notation: 'compact'
    }).format(maxTokens)

  return (
    <div className={cn('w-full space-y-2 p-3', className)} {...props}>
      {children ?? (
        <>
          <div className='flex items-center justify-between gap-3 text-xs'>
            <p>{displayPct}</p>
            <p className='font-mono text-muted-foreground'>
              {used} / {total}
            </p>
          </div>
          <div className='space-y-2'>
            <Progress className='bg-muted' value={usedPercent * PERCENT_MAX} />
          </div>
        </>
      )}
    </div>
  )
}

export type ContextContentBody = ComponentProps<'div'>

export const ContextContentBody = ({ children, className, ...props }: ContextContentBody) => (
  <div className={cn('w-full p-3', className)} {...props}>
    {children}
  </div>
)

export type ContextContentFooter = ComponentProps<'div'>

export const ContextContentFooter = ({ children, className, ...props }: ContextContentFooter) => {
  const { modelId, usage } = useContextValue(),
    costUSD = modelId
      ? estimateCost({
          modelId,
          usage: {
            input: usage?.inputTokens ?? 0,
            output: usage?.outputTokens ?? 0
          }
        }).totalUSD
      : undefined,
    totalCost = new Intl.NumberFormat('en-US', {
      currency: 'USD',
      style: 'currency'
    }).format(costUSD ?? 0)

  return (
    <div className={cn('flex w-full items-center justify-between gap-3 bg-secondary p-3 text-xs', className)} {...props}>
      {children ?? (
        <>
          <span className='text-muted-foreground'>Total cost</span>
          <span>{totalCost}</span>
        </>
      )}
    </div>
  )
}

export type ContextInputUsageProps = ComponentProps<'div'>

export const ContextInputUsage = async ({ children, className, ...props }: ContextInputUsageProps) => {
  const { modelId, usage } = useContextValue(),
    inputTokens = usage?.inputTokens ?? 0

  if (children) return children

  if (!inputTokens) return null

  const inputCost = modelId
      ? estimateCost({
          modelId,
          usage: { input: inputTokens, output: 0 }
        }).totalUSD
      : undefined,
    inputCostText = new Intl.NumberFormat('en-US', {
      currency: 'USD',
      style: 'currency'
    }).format(inputCost ?? 0)

  return (
    <div className={cn('flex items-center justify-between text-xs', className)} {...props}>
      <span className='text-muted-foreground'>Input</span>
      <TokensWithCost costText={inputCostText} tokens={inputTokens} />
    </div>
  )
}

export type ContextOutputUsageProps = ComponentProps<'div'>

export const ContextOutputUsage = async ({ children, className, ...props }: ContextOutputUsageProps) => {
  const { modelId, usage } = useContextValue(),
    outputTokens = usage?.outputTokens ?? 0

  if (children) return children

  if (!outputTokens) return null

  const outputCost = modelId
      ? estimateCost({
          modelId,
          usage: { input: 0, output: outputTokens }
        }).totalUSD
      : undefined,
    outputCostText = new Intl.NumberFormat('en-US', {
      currency: 'USD',
      style: 'currency'
    }).format(outputCost ?? 0)

  return (
    <div className={cn('flex items-center justify-between text-xs', className)} {...props}>
      <span className='text-muted-foreground'>Output</span>
      <TokensWithCost costText={outputCostText} tokens={outputTokens} />
    </div>
  )
}

export type ContextReasoningUsageProps = ComponentProps<'div'>

export const ContextReasoningUsage = async ({ children, className, ...props }: ContextReasoningUsageProps) => {
  const { modelId, usage } = useContextValue(),
    reasoningTokens = usage?.reasoningTokens ?? 0

  if (children) return children

  if (!reasoningTokens) return null

  const reasoningCost = modelId
      ? estimateCost({
          modelId,
          usage: { reasoningTokens }
        }).totalUSD
      : undefined,
    reasoningCostText = new Intl.NumberFormat('en-US', {
      currency: 'USD',
      style: 'currency'
    }).format(reasoningCost ?? 0)

  return (
    <div className={cn('flex items-center justify-between text-xs', className)} {...props}>
      <span className='text-muted-foreground'>Reasoning</span>
      <TokensWithCost costText={reasoningCostText} tokens={reasoningTokens} />
    </div>
  )
}

export type ContextCacheUsageProps = ComponentProps<'div'>

export const ContextCacheUsage = async ({ children, className, ...props }: ContextCacheUsageProps) => {
  const { modelId, usage } = useContextValue(),
    cacheTokens = usage?.cachedInputTokens ?? 0

  if (children) return children

  if (!cacheTokens) return null

  const cacheCost = modelId
      ? estimateCost({
          modelId,
          usage: { cacheReads: cacheTokens, input: 0, output: 0 }
        }).totalUSD
      : undefined,
    cacheCostText = new Intl.NumberFormat('en-US', {
      currency: 'USD',
      style: 'currency'
    }).format(cacheCost ?? 0)

  return (
    <div className={cn('flex items-center justify-between text-xs', className)} {...props}>
      <span className='text-muted-foreground'>Cache</span>
      <TokensWithCost costText={cacheCostText} tokens={cacheTokens} />
    </div>
  )
}

const TokensWithCost = ({ costText, tokens }: { costText?: string; tokens?: number }) => (
  <span>
    {tokens === undefined
      ? '—'
      : new Intl.NumberFormat('en-US', {
          notation: 'compact'
        }).format(tokens)}
    {costText ? <span className='ml-2 text-muted-foreground'>• {costText}</span> : null}
  </span>
)
