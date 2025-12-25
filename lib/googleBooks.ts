export type GoogleBook = {
  id: string
  title: string
  authors: string[]
  description?: string
  coverUrl?: string
  coverUrlLarge?: string
  pageCount?: number
  publishedDate?: string
  categories?: string[]
  isbn?: string
}

export async function searchGoogleBooks(query: string): Promise<GoogleBook[]> {
  if (!query || query.length < 2) return []
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&printType=books`
    )
    const data = await response.json()
    
    if (!data.items) return []
    
    return data.items.map((item: any) => {
      const info = item.volumeInfo
      const imageLinks = info.imageLinks || {}
      
      return {
        id: item.id,
        title: info.title || 'Unknown Title',
        authors: info.authors || ['Unknown Author'],
        description: info.description,
        coverUrl: imageLinks.thumbnail?.replace('http:', 'https:'),
        coverUrlLarge: (imageLinks.large || imageLinks.medium || imageLinks.thumbnail)?.replace('http:', 'https:'),
        pageCount: info.pageCount,
        publishedDate: info.publishedDate,
        categories: info.categories,
        isbn: info.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier ||
              info.industryIdentifiers?.find((id: any) => id.type === 'ISBN_10')?.identifier,
      }
    })
  } catch (error) {
    console.error('Google Books search failed:', error)
    return []
  }
}

export async function getBookById(bookId: string): Promise<GoogleBook | null> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${bookId}`
    )
    const item = await response.json()
    
    if (!item.volumeInfo) return null
    
    const info = item.volumeInfo
    const imageLinks = info.imageLinks || {}
    
    return {
      id: item.id,
      title: info.title || 'Unknown Title',
      authors: info.authors || ['Unknown Author'],
      description: info.description,
      coverUrl: imageLinks.thumbnail?.replace('http:', 'https:'),
      coverUrlLarge: (imageLinks.large || imageLinks.medium || imageLinks.thumbnail)?.replace('http:', 'https:'),
      pageCount: info.pageCount,
      publishedDate: info.publishedDate,
      categories: info.categories,
      isbn: info.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier,
    }
  } catch (error) {
    console.error('Google Books fetch failed:', error)
    return null
  }
}
