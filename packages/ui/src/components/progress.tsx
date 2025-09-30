'use client'

import { cn } from '@workspace/ui/lib/utils'
import { Progress as ProgressPrimitive } from 'radix-ui'
import * as React from 'react'

const Progress = ({ className, value, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root>) => (
  <ProgressPrimitive.Root
    className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', className)}
    data-slot='progress'
    {...props}>
    <ProgressPrimitive.Indicator
      className='size-full flex-1 bg-primary transition-all'
      data-slot='progress-indicator'
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
)

export { Progress }
