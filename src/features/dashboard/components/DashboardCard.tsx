"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardCardProps {
  title?: React.ReactNode
  description?: React.ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
  footerClassName?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  isLoading?: boolean
}

export function DashboardCard({
  title,
  description,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  children,
  footer,
  isLoading = false,
}: DashboardCardProps) {
  return (
    <Card className={cn("shadow-sm border overflow-hidden", className)}>
      {(title || description) && (
        <CardHeader className={cn("px-6 py-5", headerClassName)}>
          {title && typeof title === "string" ? (
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          ) : (
            title
          )}
          {description && typeof description === "string" ? (
            <CardDescription>{description}</CardDescription>
          ) : (
            description
          )}
        </CardHeader>
      )}
      <CardContent className={cn("px-6 py-5", !title && !description && "pt-6", contentClassName)}>
        {children}
      </CardContent>
      {footer && (
        <CardFooter className={cn("px-6 py-5 border-t", footerClassName)}>
          {footer}
        </CardFooter>
      )}
    </Card>
  )
}

export function DashboardCardGroup({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3", className)}>
      {children}
    </div>
  )
}

export function DashboardSection({
  title,
  description,
  className,
  children,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("mb-8", className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-semibold tracking-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
