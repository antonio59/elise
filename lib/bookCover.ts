export async function fetchBookCover(title: string, author: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${title} ${author}`)
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${query}&limit=1&fields=cover_i,title,author_name`
    )
    const data = await response.json()
    
    if (data.docs && data.docs.length > 0 && data.docs[0].cover_i) {
      return `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-L.jpg`
    }
    return null
  } catch (error) {
    console.error('Failed to fetch book cover:', error)
    return null
  }
}

export async function searchBooks(query: string): Promise<Array<{
  title: string
  author: string
  coverUrl: string | null
  year?: number
}>> {
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10&fields=title,author_name,cover_i,first_publish_year`
    )
    const data = await response.json()
    
    return (data.docs || []).map((doc: any) => ({
      title: doc.title,
      author: doc.author_name?.[0] || 'Unknown',
      coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null,
      year: doc.first_publish_year,
    }))
  } catch (error) {
    console.error('Failed to search books:', error)
    return []
  }
}
