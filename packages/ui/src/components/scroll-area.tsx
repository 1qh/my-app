'use client'

import { cn } from '@workspace/ui/lib/utils'
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui'
import * as React from 'react'

const ScrollArea = ({ children, className, ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) => (
    <ScrollAreaPrimitive.Root className={cn('relative', className)} data-slot='scroll-area' {...props}>
      <ScrollAreaPrimitive.Viewport
        className='size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1'
        data-slot='scroll-area-viewport'>
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  ),
  ScrollBar = ({
    className,
    orientation = 'vertical',
    ...props
  }: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      className={cn(
        'flex touch-none p-px transition-colors select-none',
        orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent',
        orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent',
        className
      )}
      data-slot='scroll-area-scrollbar'
      orientation={orientation}
      {...props}>
      <ScrollAreaPrimitive.ScrollAreaThumb
        className='relative flex-1 rounded-full bg-border'
        data-slot='scroll-area-thumb'
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )

export { ScrollArea, ScrollBar }
