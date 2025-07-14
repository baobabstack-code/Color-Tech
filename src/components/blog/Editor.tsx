'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <p>Loading editor...</p>
})

import 'react-quill/dist/quill.snow.css'

export default function BlogEditor({ 
  content, 
  setContent,
  className = ''
}: {
  content: string
  setContent: (value: string) => void
  className?: string
}) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered'}, { list: 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  }

  return (
    <div className={`bg-card rounded-lg border ${className}`}>
      <ReactQuill 
        theme="snow" 
        value={content} 
        onChange={setContent}
        modules={modules}
        placeholder="Write your blog content here..."
      />
    </div>
  )
}
