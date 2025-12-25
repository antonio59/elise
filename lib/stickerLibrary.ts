// Pre-made sticker library with free/open stickers
// Using emoji-style stickers and SVG stickers

export type LibrarySticker = {
  id: string
  name: string
  url: string
  category: string
}

// Using free sticker images from various open sources
// These are all G-rated and appropriate for teens
export const STICKER_LIBRARY: LibrarySticker[] = [
  // Reading & Books
  { id: 'book-love', name: 'Book Love', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4d6.svg', category: 'Reading' },
  { id: 'books-stack', name: 'Book Stack', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4da.svg', category: 'Reading' },
  { id: 'bookmark', name: 'Bookmark', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f516.svg', category: 'Reading' },
  { id: 'glasses', name: 'Reading Glasses', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f453.svg', category: 'Reading' },
  { id: 'scroll', name: 'Scroll', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4dc.svg', category: 'Reading' },
  
  // Art & Creativity
  { id: 'art-palette', name: 'Art Palette', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3a8.svg', category: 'Art' },
  { id: 'paintbrush', name: 'Paintbrush', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f58c.svg', category: 'Art' },
  { id: 'crayon', name: 'Crayon', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f58d.svg', category: 'Art' },
  { id: 'framed-pic', name: 'Framed Picture', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f5bc.svg', category: 'Art' },
  { id: 'rainbow', name: 'Rainbow', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f308.svg', category: 'Art' },
  
  // Emotions & Reactions
  { id: 'star-eyes', name: 'Star Eyes', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f929.svg', category: 'Reactions' },
  { id: 'heart-eyes', name: 'Heart Eyes', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f60d.svg', category: 'Reactions' },
  { id: 'mind-blown', name: 'Mind Blown', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f92f.svg', category: 'Reactions' },
  { id: 'crying-happy', name: 'Happy Tears', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f972.svg', category: 'Reactions' },
  { id: 'thinking', name: 'Thinking', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f914.svg', category: 'Reactions' },
  { id: 'fire', name: 'Fire', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f525.svg', category: 'Reactions' },
  { id: 'sparkles', name: 'Sparkles', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2728.svg', category: 'Reactions' },
  { id: '100', name: '100', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4af.svg', category: 'Reactions' },
  
  // Stars & Awards
  { id: 'star', name: 'Star', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2b50.svg', category: 'Awards' },
  { id: 'glowing-star', name: 'Glowing Star', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f31f.svg', category: 'Awards' },
  { id: 'trophy', name: 'Trophy', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3c6.svg', category: 'Awards' },
  { id: 'medal', name: 'Medal', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3c5.svg', category: 'Awards' },
  { id: 'ribbon', name: 'Ribbon', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f380.svg', category: 'Awards' },
  { id: 'crown', name: 'Crown', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f451.svg', category: 'Awards' },
  
  // Hearts & Love
  { id: 'red-heart', name: 'Red Heart', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2764.svg', category: 'Hearts' },
  { id: 'pink-heart', name: 'Pink Heart', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1fa77.svg', category: 'Hearts' },
  { id: 'purple-heart', name: 'Purple Heart', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f49c.svg', category: 'Hearts' },
  { id: 'sparkling-heart', name: 'Sparkling Heart', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f496.svg', category: 'Hearts' },
  { id: 'growing-heart', name: 'Growing Heart', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f497.svg', category: 'Hearts' },
  
  // Animals (cute ones)
  { id: 'cat', name: 'Cat', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f431.svg', category: 'Animals' },
  { id: 'dog', name: 'Dog', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f436.svg', category: 'Animals' },
  { id: 'unicorn', name: 'Unicorn', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f984.svg', category: 'Animals' },
  { id: 'butterfly', name: 'Butterfly', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98b.svg', category: 'Animals' },
  { id: 'dragon', name: 'Dragon', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f409.svg', category: 'Animals' },
  { id: 'owl', name: 'Owl', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f989.svg', category: 'Animals' },
  
  // Magic & Fantasy
  { id: 'magic-wand', name: 'Magic Wand', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1fa84.svg', category: 'Magic' },
  { id: 'crystal-ball', name: 'Crystal Ball', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f52e.svg', category: 'Magic' },
  { id: 'fairy', name: 'Fairy', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f9da.svg', category: 'Magic' },
  { id: 'wizard', name: 'Wizard', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f9d9.svg', category: 'Magic' },
  { id: 'castle', name: 'Castle', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3f0.svg', category: 'Magic' },
  { id: 'magic-mirror', name: 'Magic Mirror', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1fa9e.svg', category: 'Magic' },
  
  // Nature
  { id: 'cherry-blossom', name: 'Cherry Blossom', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f338.svg', category: 'Nature' },
  { id: 'sunflower', name: 'Sunflower', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f33b.svg', category: 'Nature' },
  { id: 'four-leaf', name: 'Four Leaf Clover', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f340.svg', category: 'Nature' },
  { id: 'moon', name: 'Moon', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f319.svg', category: 'Nature' },
  { id: 'sun', name: 'Sun', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2600.svg', category: 'Nature' },
  { id: 'cloud', name: 'Cloud', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2601.svg', category: 'Nature' },
]

export const STICKER_CATEGORIES = [...new Set(STICKER_LIBRARY.map(s => s.category))]

export function getStickersByCategory(category: string): LibrarySticker[] {
  return STICKER_LIBRARY.filter(s => s.category === category)
}
