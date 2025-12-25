'use client'
import EmojiPicker from './EmojiPicker'
import GiphyPicker from './GiphyPicker'
import StickerLibraryPicker from './StickerLibraryPicker'

type RichTextToolbarProps = {
  onEmojiSelect: (emoji: string) => void
  onGifSelect: (gif: { id: string; url: string; width: number; height: number }) => void
  onStickerSelect: (sticker: { name: string; url: string }) => void
}

export default function RichTextToolbar({ 
  onEmojiSelect, 
  onGifSelect, 
  onStickerSelect 
}: RichTextToolbarProps) {
  return (
    <div className="flex items-center gap-1 border-t border-gray-200 pt-2 mt-2">
      <EmojiPicker onSelect={onEmojiSelect} />
      <GiphyPicker onSelect={onGifSelect} />
      <StickerLibraryPicker onSelect={onStickerSelect} />
    </div>
  )
}
