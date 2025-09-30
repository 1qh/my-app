'use client'

import { cn } from '@workspace/ui/lib/utils'
import { Separator as SeparatorPrimitive } from 'radix-ui'
import * as React from 'react'

const Separator = ({
  className,
  decorative = true,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) => (
  <SeparatorPrimitive.Root
    className={cn(
      'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      className
    )}
    data-slot='separator'
    decorative={decorative}
    orientation={orientation}
    {...props}
  />
)

export { Separator }
