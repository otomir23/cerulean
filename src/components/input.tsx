import {ComponentProps} from 'react';
import {VariantProps} from 'cva';
import {cva} from '@/cva.config';

const inputStyles = cva({
    base: 'transition-colors focus:outline-none focus:ring text-black font-normal text-base',
    variants: {
        type: {
            text: '',
            email: '',
            password: '',
            hidden: 'hidden'
        },
        intent: {
            secondary: 'focus:ring-neutral-300',
        },
    },
    compoundVariants: [
        {
            type: ['text', 'password', 'email'],
            class: 'rounded-lg border px-4 py-2',
        },
        {
            type: ['text', 'password', 'email'],
            intent: 'secondary',
            class: 'border-neutral-300 placeholder:text-neutral-300 focus:border-neutral-500',
        },
    ],
    defaultVariants: {
        type: 'text',
        intent: 'secondary',
    },
})

export type InputProps = ComponentProps<'input'> & VariantProps<typeof inputStyles> & {
    label?: string
}

export default function Input(
    {type, className, label, ...props}: InputProps
) {
    const content = (
        <input
            type={type}
            className={inputStyles({
                type,
                className,
            })}
            {...props}
        />
    )
    return (
        label ? (
            <label className="text-sm font-semibold text-neutral-800 flex flex-col gap-1">
                {label}
                {content}
            </label>
        ) : content
    )
}