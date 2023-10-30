import {ComponentProps} from 'react';
import {cva} from '@/cva.config';
import {VariantProps} from "cva";
import {LucideIcon} from "lucide-react";

const buttonStyles = cva({
    base: `flex flex-wrap items-center justify-center gap-2 rounded-md px-4 py-2 select-none border
    font-semibold transition-colors focus:outline-none focus:ring disabled:animate-pulse disabled:cursor-not-allowed`,
    variants: {
        intent: {
            primary: 'bg-blue-600 text-blue-50 ring-blue-300 hover:bg-blue-600 active:bg-blue-500 disabled:text-blue-400 border-blue-800',
            secondary: 'bg-neutral-50 text-neutral-900 ring-neutral-200 hover:bg-neutral-100 active:bg-neutral-50 disabled:text-neutral-400 border-neutral-300',
        },
    },
    defaultVariants: {
        intent: 'secondary',
    },
})

export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonStyles> & {
    icon?: LucideIcon
}

export default function Button({className, intent, icon: Icon, children, ...props}: ButtonProps) {
    return (
        <button className={buttonStyles({intent, className})} {...props}>
            {Icon && <Icon size={16}/>}
            {children}
        </button>
    )
}