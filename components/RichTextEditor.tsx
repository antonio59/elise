'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import EmojiPicker from './EmojiPicker'
import StickerPicker from './StickerPicker'
import GiphyPicker from './GiphyPicker'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  customStickers?: Array<{ id: string; name: string; imageUrl: string }>
  onGifAdd?: (gif: { id: string; url: string; width: number; height: number }) => void
  minHeight?: string
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing your review...",
  customStickers = [],
  onGifAdd,
  minHeight = "300px"
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder }),
      Image.configure({ inline: true }),
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-neutral dark:prose-invert max-w-none focus:outline-none',
        style: `min-height: ${minHeight}`,
      },
    },
  })

  if (!editor) return null

  const insertEmoji = (emoji: string) => {
    editor.chain().focus().insertContent(emoji).run()
  }

  const insertSticker = (sticker: string, isCustom?: boolean, imageUrl?: string) => {
    if (isCustom && imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl, alt: sticker }).run()
    } else {
      editor.chain().focus().insertContent(`<span class="text-4xl">${sticker}</span>`).run()
    }
  }

  const MenuButton = ({ 
    onClick, 
    isActive = false, 
    children 
  }: { 
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode 
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-inkPink text-white' 
          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-white dark:bg-neutral-900">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
        <div className="flex items-center gap-1 pr-2 border-r border-neutral-200 dark:border-neutral-700">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
          >
            <span className="font-bold text-lg">H1</span>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
          >
            <span className="font-bold">H2</span>
          </MenuButton>
        </div>

        <div className="flex items-center gap-1 pr-2 border-r border-neutral-200 dark:border-neutral-700">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
          >
            <span className="font-bold">B</span>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
          >
            <span className="italic">I</span>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
          >
            <span className="line-through">S</span>
          </MenuButton>
        </div>

        <div className="flex items-center gap-1 pr-2 border-r border-neutral-200 dark:border-neutral-700">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
          >
            <span>•≡</span>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
          >
            <span>1.</span>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
          >
            <span>"</span>
          </MenuButton>
        </div>

        <div className="flex items-center gap-1">
          <EmojiPicker onSelect={insertEmoji} />
          <StickerPicker onSelect={insertSticker} customStickers={customStickers} />
          {onGifAdd && <GiphyPicker onSelect={onGifAdd} />}
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
