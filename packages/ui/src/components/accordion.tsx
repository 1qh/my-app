'use client'

import { cn } from '@workspace/ui/lib/utils'
import { ChevronDownIcon } from 'lucide-react'
import { Accordion as AccordionPrimitive } from 'radix-ui'
import * as React from 'react'

const Accordion = ({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) => (
    <AccordionPrimitive.Root data-slot='accordion' {...props} />
  ),
  AccordionItem = ({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) => (
    <AccordionPrimitive.Item className={cn('border-b last:border-b-0', className)} data-slot='accordion-item' {...props} />
  ),
  AccordionTrigger = ({ children, className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) => (
    <AccordionPrimitive.Header className='flex'>
      <AccordionPrimitive.Trigger
        className={cn(
          'flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
          className
        )}
        data-slot='accordion-trigger'
        {...props}>
        {children}
        <ChevronDownIcon className='pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200' />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  ),
  AccordionContent = ({ children, className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) => (
    <AccordionPrimitive.Content
      className='overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
      data-slot='accordion-content'
      {...props}>
      <div className={cn('pt-0 pb-4', className)}>{children}</div>
    </AccordionPrimitive.Content>
  )

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
