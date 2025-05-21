"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface CalendarProps {
  className?: string
  value?: Date
  onChange?: (date: Date) => void
  disabled?: boolean
}

function Calendar({
  className,
  value = new Date(),
  onChange,
  disabled = false,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(value)
  const [currentMonth, setCurrentMonth] = React.useState(value.getMonth())
  const [currentYear, setCurrentYear] = React.useState(value.getFullYear())

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]

  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDayClick = (day: number) => {
    if (disabled) return
    const newDate = new Date(currentYear, currentMonth, day)
    setCurrentDate(newDate)
    onChange?.(newDate)
  }

  return (
    <div className={cn("p-3 bg-background rounded-lg border shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          )}
          disabled={disabled}
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-medium">
          {monthNames[currentMonth]} {currentYear}
        </span>
        <button
          onClick={handleNextMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          )}
          disabled={disabled}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {days.map((day) => {
          const isSelected = 
            currentDate.getDate() === day &&
            currentDate.getMonth() === currentMonth &&
            currentDate.getFullYear() === currentYear
          
          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              disabled={disabled}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "size-8 p-0 font-normal",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { Calendar }
