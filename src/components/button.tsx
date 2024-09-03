import { ComponentProps, ReactNode } from "react";
import { tv, VariantProps } from "tailwind-variants";


const buttonVariants = tv({
  base: 'items-center gap-2 rounded-lg px-5 justify-center flex font-medium',
  variants: {
    variant: {
      primary: 'bg-lime-300 text-lime-950 hover:bg-lime-400',
      secondary: 'flex bg-zinc-800 text-zinc-200 hover:bg-zinc-600'
    },

    size : {
      default: 'py-2',
      full: 'w-full h-11'
    }
  },

  defaultVariants: {
    variant: 'primary',
    size: 'default'
  }
})

interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  children: ReactNode
}

export function Button({children, variant, size, ...props}: ButtonProps) {
  return (
    <button {...props} className={buttonVariants({variant, size})}>
      {children}
    </button>
  )
}
