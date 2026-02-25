'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Link as LinkIcon, Image as ImageIcon,
    Table as TableIcon, Code, Undo, Redo, Heading1, Heading2, Heading3,
    Quote, CheckSquare, X
} from 'lucide-react';
import { useCallback } from 'react';

const MenuButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-2 rounded-lg transition-colors flex items-center justify-center
      ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
    >
        {children}
    </button>
);

export default function RichTextEditor({
    content,
    onChange,
}: {
    content: string;
    onChange: (html: string) => void;
}) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-xl max-w-full h-auto shadow-md my-4',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse table-auto w-full my-4',
                },
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] px-6 py-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    const setLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        if (!editor) return;

        // Create an input element of type file
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            // Optional: Check file size (e.g., limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size exceeds 5MB limit.');
                return;
            }

            try {
                // Generate a unique file name
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                const filePath = `blog-images/${fileName}`;

                // Import supabase client dynamically or expect it to be available (we should ideally pass an upload handler or use the app's supabase client)
                // Assuming we use the standard API route or supabase client directly if available in the component. We will use the client side supabase instance.
                const { createClient } = await import('@supabase/supabase-js');
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cafwmpzdgatxpavuwnvh.supabase.co';
                const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_S5cNoYZ_FXWt9nHOwWGHjg_N1mVxbvV'; // Use anon key for client, or better, pass an upload function

                // Fallback: Use the same approach as elsewhere if we must use direct client
                const supabase = createClient(supabaseUrl, supabaseKey);

                // Upload to the existing 'assets' bucket, or a dedicated 'blog-images' bucket if it exists. Reusing 'assets' is safest.
                const { data, error } = await supabase.storage
                    .from('assets')
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false,
                    });

                if (error) {
                    console.error('Upload Error:', error);
                    alert('Error uploading image: ' + error.message);
                    return;
                }

                // Get public URL
                const { data: publicUrlData } = supabase.storage
                    .from('assets')
                    .getPublicUrl(filePath);

                if (publicUrlData && publicUrlData.publicUrl) {
                    // Insert the image into the editor
                    editor.chain().focus().setImage({ src: publicUrlData.publicUrl }).run();
                }

            } catch (err: any) {
                console.error('Failed to upload image', err);
                alert('Failed to upload image. Please try again.');
            }
        };

        input.click();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
                {/* History */}
                <div className="flex gap-0.5 border-r border-gray-300 pr-2 mr-1">
                    <MenuButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo"
                    >
                        <Undo size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo"
                    >
                        <Redo size={18} />
                    </MenuButton>
                </div>

                {/* Text Formatting */}
                <div className="flex gap-0.5 border-r border-gray-300 pr-2 mr-1">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Bold"
                    >
                        <Bold size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Italic"
                    >
                        <Italic size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        title="Underline"
                    >
                        <UnderlineIcon size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="Strikethrough"
                    >
                        <Strikethrough size={18} />
                    </MenuButton>
                </div>

                {/* Headings */}
                <div className="flex gap-0.5 border-r border-gray-300 pr-2 mr-1">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        title="H1"
                    >
                        <Heading1 size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        title="H2"
                    >
                        <Heading2 size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        title="H3"
                    >
                        <Heading3 size={18} />
                    </MenuButton>
                </div>

                {/* Alignment */}
                <div className="flex gap-0.5 border-r border-gray-300 pr-2 mr-1">
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        isActive={editor.isActive({ textAlign: 'left' })}
                        title="Left"
                    >
                        <AlignLeft size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        isActive={editor.isActive({ textAlign: 'center' })}
                        title="Center"
                    >
                        <AlignCenter size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        isActive={editor.isActive({ textAlign: 'right' })}
                        title="Right"
                    >
                        <AlignRight size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        isActive={editor.isActive({ textAlign: 'justify' })}
                        title="Justify"
                    >
                        <AlignJustify size={18} />
                    </MenuButton>
                </div>

                {/* Lists */}
                <div className="flex gap-0.5 border-r border-gray-300 pr-2 mr-1">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Bullet List"
                    >
                        <List size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Ordered List"
                    >
                        <ListOrdered size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="Quote"
                    >
                        <Quote size={18} />
                    </MenuButton>
                </div>

                {/* Insert */}
                <div className="flex gap-0.5 border-r border-gray-300 pr-2 mr-1">
                    <MenuButton
                        onClick={setLink}
                        isActive={editor.isActive('link')}
                        title="Link"
                    >
                        <LinkIcon size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={addImage}
                        title="Image"
                    >
                        <ImageIcon size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                        title="Insert Table"
                    >
                        <TableIcon size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        isActive={editor.isActive('codeBlock')}
                        title="Code Block"
                    >
                        <Code size={18} />
                    </MenuButton>
                </div>

            </div>

            {/* Bubble Menu Removed due to compatibility issues */}

            {/* Editor Content */}
            <EditorContent editor={editor} />

            {/* Global Styles for Editor Content */}
            <style jsx global>{`
                .ProseMirror table {
                    border-collapse: collapse;
                    margin: 0;
                    overflow: hidden;
                    table-layout: fixed;
                    width: 100%;
                }
                .ProseMirror td, .ProseMirror th {
                    border: 2px solid #ced4da;
                    box-sizing: border-box;
                    min-width: 1em;
                    padding: 6px 12px;
                    position: relative;
                    vertical-align: top;
                }
                .ProseMirror th {
                    background-color: #f8f9fa;
                    font-weight: bold;
                    text-align: left;
                }
                .ProseMirror blockquote {
                    border-left: 3px solid #ddd;
                    padding-left: 1rem;
                    font-style: italic;
                    color: #555;
                }
                .ProseMirror pre {
                    background: #0d0d0d;
                    color: #fff;
                    font-family: 'JetBrains Mono', monospace;
                    padding: 0.75rem 1rem;
                    border-radius: 0.5rem;
                }
            `}</style>
        </div>
    );
}
