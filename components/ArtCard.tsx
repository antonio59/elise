'use client'

type ArtCardProps = {
  title: string
  imageUrl: string
  style?: string
  onClick?: () => void
}

export default function ArtCard({ title, imageUrl, style, onClick }: ArtCardProps) {
  return (
    <div 
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100 group-hover:shadow-lg transition-all duration-300">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="mt-3 px-1">
        <h3 className="font-bold text-gray-900">{title}</h3>
        {style && (
          <p className="text-sm text-gray-500 mt-0.5">{style}</p>
        )}
      </div>
    </div>
  )
}

export function ArtCardSkeleton() {
  return (
    <div>
      <div className="aspect-square skeleton rounded-2xl" />
      <div className="mt-3 px-1 space-y-2">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
      </div>
    </div>
  )
}
