'use client'

import { cn } from '@workspace/ui/lib/utils'
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'
import { Menubar as MenubarPrimitive } from 'radix-ui'
import * as React from 'react'

const Menubar = ({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Root>) => (
    <MenubarPrimitive.Root
      className={cn('flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs', className)}
      data-slot='menubar'
      {...props}
    />
  ),
  MenubarMenu = ({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Menu>) => (
    <MenubarPrimitive.Menu data-slot='menubar-menu' {...props} />
  ),
  MenubarGroup = ({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Group>) => (
    <MenubarPrimitive.Group data-slot='menubar-group' {...props} />
  ),
  MenubarPortal = ({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Portal>) => (
    <MenubarPrimitive.Portal data-slot='menubar-portal' {...props} />
  ),
  MenubarRadioGroup = ({ ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) => (
    <MenubarPrimitive.RadioGroup data-slot='menubar-radio-group' {...props} />
  ),
  MenubarTrigger = ({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Trigger>) => (
    <MenubarPrimitive.Trigger
      className={cn(
        'flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        className
      )}
      data-slot='menubar-trigger'
      {...props}
    />
  ),
  MenubarContent = ({
    align = 'start',
    alignOffset = -4,
    className,
    sideOffset = 8,
    ...props
  }: React.ComponentProps<typeof MenubarPrimitive.Content>) => (
    <MenubarPortal>
      <MenubarPrimitive.Content
        align={align}
        alignOffset={alignOffset}
        className={cn(
          'z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          className
        )}
        data-slot='menubar-content'
        sideOffset={sideOffset}
        {...props}
      />
    </MenubarPortal>
  ),
  MenubarItem = ({
    className,
    inset,
    variant = 'default',
    ...props
  }: React.ComponentProps<typeof MenubarPrimitive.Item> & {
    inset?: boolean
    variant?: 'default' | 'destructive'
  }) => (
    <MenubarPrimitive.Item
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:!text-destructive",
        className
      )}
      data-inset={inset}
      data-slot='menubar-item'
      data-variant={variant}
      {...props}
    />
  ),
  MenubarCheckboxItem = ({
    checked,
    children,
    className,
    ...props
  }: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) => (
    <MenubarPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-slot='menubar-checkbox-item'
      {...props}>
      <span className='pointer-events-none absolute left-2 flex size-3.5 items-center justify-center'>
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className='size-4' />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  ),
  MenubarRadioItem = ({ children, className, ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) => (
    <MenubarPrimitive.RadioItem
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-slot='menubar-radio-item'
      {...props}>
      <span className='pointer-events-none absolute left-2 flex size-3.5 items-center justify-center'>
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className='size-2 fill-current' />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  ),
  MenubarLabel = ({
    className,
    inset,
    ...props
  }: React.ComponentProps<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }) => (
    <MenubarPrimitive.Label
      className={cn('px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', className)}
      data-inset={inset}
      data-slot='menubar-label'
      {...props}
    />
  ),
  MenubarSeparator = ({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Separator>) => (
    <MenubarPrimitive.Separator
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      data-slot='menubar-separator'
      {...props}
    />
  ),
  MenubarShortcut = ({ className, ...props }: React.ComponentProps<'span'>) => (
    <span
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      data-slot='menubar-shortcut'
      {...props}
    />
  ),
  MenubarSub = ({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Sub>) => (
    <MenubarPrimitive.Sub data-slot='menubar-sub' {...props} />
  ),
  MenubarSubTrigger = ({
    children,
    className,
    inset,
    ...props
  }: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }) => (
    <MenubarPrimitive.SubTrigger
      className={cn(
        'flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        className
      )}
      data-inset={inset}
      data-slot='menubar-sub-trigger'
      {...props}>
      {children}
      <ChevronRightIcon className='ml-auto h-4 w-4' />
    </MenubarPrimitive.SubTrigger>
  ),
  MenubarSubContent = ({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.SubContent>) => (
    <MenubarPrimitive.SubContent
      className={cn(
        'z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        className
      )}
      data-slot='menubar-sub-content'
      {...props}
    />
  )

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger
}
