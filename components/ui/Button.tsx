import React from "react"
import Link from "next/link"

type ButtonProps = {
  children: React.ReactNode
  href?: string
  variant?: "primary" | "secondary" | "ghost"
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold transition"

  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-white text-indigo-600 border border-gray-200 hover:bg-gray-50",
    ghost: "bg-transparent text-indigo-600 hover:bg-indigo-50",
  }

  const classes = `${base} ${variants[variant]} ${className}`

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}