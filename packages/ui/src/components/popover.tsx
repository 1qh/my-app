'use client'

import { cn } from '@workspace/ui/lib/utils'
import { Popover as PopoverPrimitive } from 'radix-ui'
import * as React from 'react'

const Popover = ({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) => (
    <PopoverPrimitive.Root data-slot='popover' {...props} />
  ),
  PopoverTrigger = ({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) => (
    <PopoverPrimitive.Trigger data-slot='popover-trigger' {...props} />
  ),
  PopoverContent = ({
    align = 'center',
    className,
    sideOffset = 4,
    ...props
  }: React.ComponentProps<typeof PopoverPrimitive.Content>) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        className={cn(
          'z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          className
        )}
        data-slot='popover-content'
        sideOffset={sideOffset}
        {...props}
      />
    </PopoverPrimitive.Portal>
  ),
  PopoverAnchor = ({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Anchor>) => (
    <PopoverPrimitive.Anchor data-slot='popover-anchor' {...props} />
  )

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger }
