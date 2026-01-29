'use client'

import type { ToolUIPart } from 'ai'
import type { ComponentProps, ReactNode } from 'react'

import { Alert, AlertDescription } from '@workspace/ui/components/alert'
import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'
import { createContext, use } from 'react'

interface ConfirmationContextValue {
  approval: ToolUIPartApproval
  state: ToolUIPart['state']
}

type ToolUIPartApproval =
  | undefined
  | {
      approved: boolean
      id: string
      reason?: string
    }
  | {
      approved: false
      id: string
      reason?: string
    }
  | {
      approved: true
      id: string
      reason?: string
    }
  | {
      approved?: never
      id: string
      reason?: never
    }

const ConfirmationContext = createContext<ConfirmationContextValue | null>(null),
  useConfirmation = () => {
    const context = use(ConfirmationContext)

    if (!context) throw new Error('Confirmation components must be used within Confirmation')

    return context
  }

export type ConfirmationProps = ComponentProps<typeof Alert> & {
  approval?: ToolUIPartApproval
  state: ToolUIPart['state']
}

export const Confirmation = ({ approval, className, state, ...props }: ConfirmationProps) => {
  if (!approval || state === 'input-streaming' || state === 'input-available') return null

  return (
    <ConfirmationContext value={{ approval, state }}>
      <Alert className={cn('flex flex-col gap-2', className)} {...props} />
    </ConfirmationContext>
  )
}

export type ConfirmationTitleProps = ComponentProps<typeof AlertDescription>

export const ConfirmationTitle = ({ className, ...props }: ConfirmationTitleProps) => (
  <AlertDescription className={cn('inline', className)} {...props} />
)

export interface ConfirmationRequestProps {
  children?: ReactNode
}

export const ConfirmationRequest = async ({ children }: ConfirmationRequestProps) => {
  const { state } = useConfirmation()

  // Only show when approval is requested
  // @ts-expect-error state only available in AI SDK v6
  if (state !== 'approval-requested') return null

  return children
}

export interface ConfirmationAcceptedProps {
  children?: ReactNode
}

export const ConfirmationAccepted = async ({ children }: ConfirmationAcceptedProps) => {
  const { approval, state } = useConfirmation()

  // Only show when approved and in response states
  if (
    !approval?.approved ||
    // @ts-expect-error state only available in AI SDK v6
    (state !== 'approval-responded' &&
      // @ts-expect-error state only available in AI SDK v6
      state !== 'output-denied' &&
      state !== 'output-available')
  )
    return null

  return children
}

export interface ConfirmationRejectedProps {
  children?: ReactNode
}

export const ConfirmationRejected = async ({ children }: ConfirmationRejectedProps) => {
  const { approval, state } = useConfirmation()

  // Only show when rejected and in response states
  if (
    approval?.approved !== false ||
    // @ts-expect-error state only available in AI SDK v6
    (state !== 'approval-responded' &&
      // @ts-expect-error state only available in AI SDK v6
      state !== 'output-denied' &&
      state !== 'output-available')
  )
    return null

  return children
}

export type ConfirmationActionsProps = ComponentProps<'div'>

export const ConfirmationActions = ({ className, ...props }: ConfirmationActionsProps) => {
  const { state } = useConfirmation()

  // Only show when approval is requested
  // @ts-expect-error state only available in AI SDK v6
  if (state !== 'approval-requested') return null

  return <div className={cn('flex items-center justify-end gap-2 self-end', className)} {...props} />
}

export type ConfirmationActionProps = ComponentProps<typeof Button>

export const ConfirmationAction = (props: ConfirmationActionProps) => (
  <Button className='h-8 px-3 text-sm' type='button' {...props} />
)
