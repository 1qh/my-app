import type { UIMessage } from 'ai'
import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps, HTMLAttributes } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@workspace/components/ui/avatar'
import { cn } from '@workspace/ui/lib/utils'
import { cva } from 'class-variance-authority'

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage['role']
}

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      'group flex w-full items-end justify-end gap-2 py-4',
      from === 'user' ? 'is-user' : 'is-assistant flex-row-reverse justify-end',
      className
    )}
    {...props}
  />
)

const messageContentVariants = cva('is-user:dark flex flex-col gap-2 overflow-hidden rounded-lg text-sm', {
  defaultVariants: {
    variant: 'contained'
  },
  variants: {
    variant: {
      contained: [
        'max-w-[80%] px-4 py-3',
        'group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground',
        'group-[.is-assistant]:bg-secondary group-[.is-assistant]:text-foreground'
      ],
      flat: [
        'group-[.is-user]:max-w-[80%] group-[.is-user]:bg-secondary group-[.is-user]:px-4 group-[.is-user]:py-3 group-[.is-user]:text-foreground',
        'group-[.is-assistant]:text-foreground'
      ]
    }
  }
})

export type MessageContentProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof messageContentVariants>

export const MessageContent = ({ children, className, variant, ...props }: MessageContentProps) => (
  <div className={cn(messageContentVariants({ className, variant }))} {...props}>
    {children}
  </div>
)

export type MessageAvatarProps = ComponentProps<typeof Avatar> & {
  name?: string
  src: string
}

export const MessageAvatar = ({ className, name, src, ...props }: MessageAvatarProps) => (
  <Avatar className={cn('size-8 ring-1 ring-border', className)} {...props}>
    <AvatarImage alt='' className='my-0' src={src} />
    <AvatarFallback>{name?.slice(0, 2) || 'ME'}</AvatarFallback>
  </Avatar>
)
