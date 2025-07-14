'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ContentService } from '@/services/content'
import PostForm from '@/components/blog/PostForm'

export default function EditPostPage() {
  const params = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await ContentService.getPost(params.id as string)
        setPost(data)
      } catch (error) {
        console.error('Failed to fetch post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.id])

  if (loading) {
    return (
      <div className="container py-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container py-8">
        <p className="text-center text-danger">Post not found</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <PostForm initialData={post} />
    </div>
  )
}
