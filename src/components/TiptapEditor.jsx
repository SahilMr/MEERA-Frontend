import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`rounded px-2 py-1 text-sm font-medium transition ${
          editor.isActive('bold')
            ? 'bg-slate-200 text-slate-900'
            : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
        }`}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`rounded px-2 py-1 text-sm font-medium transition ${
          editor.isActive('italic')
            ? 'bg-slate-200 text-slate-900'
            : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
        }`}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`rounded px-2 py-1 text-sm font-medium transition ${
          editor.isActive('bulletList')
            ? 'bg-slate-200 text-slate-900'
            : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
        }`}
      >
        Bullet List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`rounded px-2 py-1 text-sm font-medium transition ${
          editor.isActive('orderedList')
            ? 'bg-slate-200 text-slate-900'
            : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
        }`}
      >
        Ordered List
      </button>
    </div>
  );
};

export default function TiptapEditor({ value, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[150px] p-4 text-slate-900',
        placeholder: placeholder || 'Type your note...',
      },
    },
    onUpdate: ({ editor }) => {
      // Use HTML for rich text. If we just want text, we can use editor.getText()
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
