'use client'

import type { ComponentProps, HTMLAttributes, ReactNode } from 'react'

import { Button } from '@workspace/components/ui/button'
import { cn } from '@workspace/ui/lib/utils'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { createContext, use, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockContextType {
  code: string
}

const CodeBlockContext = createContext<CodeBlockContextType>({
  code: ''
})

export type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode
  code: string
  language: string
  showLineNumbers?: boolean
}

export const CodeBlock = ({ children, className, code, language, showLineNumbers = false, ...props }: CodeBlockProps) => (
  <CodeBlockContext value={{ code }}>
    <div
      className={cn('relative w-full overflow-hidden rounded-md border bg-background text-foreground', className)}
      {...props}>
      <div className='relative'>
        <SyntaxHighlighter
          className='overflow-hidden dark:hidden'
          codeTagProps={{
            className: 'font-mono text-sm'
          }}
          customStyle={{
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            fontSize: '0.875rem',
            margin: 0,
            padding: '1rem'
          }}
          language={language}
          lineNumberStyle={{
            color: 'hsl(var(--muted-foreground))',
            minWidth: '2.5rem',
            paddingRight: '1rem'
          }}
          showLineNumbers={showLineNumbers}
          style={oneLight}>
          {code}
        </SyntaxHighlighter>
        <SyntaxHighlighter
          className='hidden overflow-hidden dark:block'
          codeTagProps={{
            className: 'font-mono text-sm'
          }}
          customStyle={{
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            fontSize: '0.875rem',
            margin: 0,
            padding: '1rem'
          }}
          language={language}
          lineNumberStyle={{
            color: 'hsl(var(--muted-foreground))',
            minWidth: '2.5rem',
            paddingRight: '1rem'
          }}
          showLineNumbers={showLineNumbers}
          style={oneDark}>
          {code}
        </SyntaxHighlighter>
        {children ? <div className='absolute top-2 right-2 flex items-center gap-2'>{children}</div> : null}
      </div>
    </div>
  </CodeBlockContext>
)

export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void
  onError?: (error: Error) => void
  timeout?: number
}

export const CodeBlockCopyButton = ({
  children,
  className,
  onCopy,
  onError,
  timeout = 2000,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false),
    { code } = use(CodeBlockContext),
    copyToClipboard = async () => {
      if (typeof window === 'undefined' || !navigator.clipboard.writeText) {
        onError?.(new Error('Clipboard API not available'))
        return
      }

      try {
        await navigator.clipboard.writeText(code)
        setIsCopied(true)
        onCopy?.()
        setTimeout(() => setIsCopied(false), timeout)
      } catch (error) {
        onError?.(error as Error)
      }
    },
    Icon = isCopied ? CheckIcon : CopyIcon

  return (
    <Button className={cn('shrink-0', className)} onClick={copyToClipboard} size='icon' variant='ghost' {...props}>
      {children ?? <Icon size={14} />}
    </Button>
  )
}
