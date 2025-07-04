'use client'

import { cn } from '@workspace/ui/lib/utils'
import { XIcon } from 'lucide-react'
import { Dialog as SheetPrimitive } from 'radix-ui'
import * as React from 'react'

const Sheet = ({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) => (
    <SheetPrimitive.Root data-slot='sheet' {...props} />
  ),
  SheetTrigger = ({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) => (
    <SheetPrimitive.Trigger data-slot='sheet-trigger' {...props} />
  ),
  SheetClose = ({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) => (
    <SheetPrimitive.Close data-slot='sheet-close' {...props} />
  ),
  SheetPortal = ({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) => (
    <SheetPrimitive.Portal data-slot='sheet-portal' {...props} />
  ),
  SheetOverlay = ({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>) => (
    <SheetPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
        className
      )}
      data-slot='sheet-overlay'
      {...props}
    />
  ),
  SheetContent = ({
    children,
    className,
    side = 'right',
    ...props
  }: React.ComponentProps<typeof SheetPrimitive.Content> & {
    side?: 'bottom' | 'left' | 'right' | 'top'
  }) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        className={cn(
          'fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=open]:duration-500',
          side === 'right' &&
            'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
          side === 'left' &&
            'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
          side === 'top' &&
            'inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
          side === 'bottom' &&
            'inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
          className
        )}
        data-slot='sheet-content'
        {...props}>
        {children}
        <SheetPrimitive.Close className='absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary'>
          <XIcon className='size-4' />
          <span className='sr-only'>Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  ),
  SheetHeader = ({ className, ...props }: React.ComponentProps<'div'>) => (
    <div className={cn('flex flex-col gap-1.5 p-4', className)} data-slot='sheet-header' {...props} />
  ),
  SheetFooter = ({ className, ...props }: React.ComponentProps<'div'>) => (
    <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} data-slot='sheet-footer' {...props} />
  ),
  SheetTitle = ({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) => (
    <SheetPrimitive.Title className={cn('font-semibold text-foreground', className)} data-slot='sheet-title' {...props} />
  ),
  SheetDescription = ({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) => (
    <SheetPrimitive.Description
      className={cn('text-sm text-muted-foreground', className)}
      data-slot='sheet-description'
      {...props}
    />
  )

export { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger }
