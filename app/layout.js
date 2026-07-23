import { Geist } from 'next/font/google'
import './globals.css'
import { MealPlanProvider } from '../lib/mealPlanContext'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata = {
  title: 'Meal Planner',
  description: 'Plan your weekly meals beautifully.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-gray-50 dark:bg-gray-950 font-[var(--font-geist),_system-ui,_sans-serif] antialiased">
        <MealPlanProvider>
          {children}
        </MealPlanProvider>
      </body>
    </html>
  )
}
