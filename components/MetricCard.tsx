'use client'

type MetricCardProps = {
  title: string
  value: string | number
  subtitle?: string
  icon: string
  variant?: 'purple' | 'mint' | 'gold' | 'default'
}

export default function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon,
  variant = 'default' 
}: MetricCardProps) {
  const variantClasses = {
    purple: 'metric-card-purple',
    mint: 'metric-card-mint',
    gold: 'metric-card-gold',
    default: 'metric-card'
  }

  return (
    <div className={`${variantClasses[variant]} rounded-2xl p-6 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  )
}
