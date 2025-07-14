'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Loader2, Image as ImageIcon, Eye } from 'lucide-react'
import BlogEditor from '@/components/blog/Editor'
import GalleryPicker from '@/components/media/GalleryPicker'
import { ContentService } from '@/services/content'
import { useToast } from '@/components/ui/use-toast'

type PostFormProps = {
  initialData?: {
    id?: number
    title: string
    content: string
    excerpt?: string
    imageUrl?: string
    isPublished?: boolean
    slug?: string
  }
}

export default function PostForm({ initialData }: PostFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    imageUrl: initialData?.imageUrl || '',
    isPublished: initialData?.isPublished || false,
    slug: initialData?.slug || ''
  })
  const [loading, setLoading] = useState(false)
  const [showGallery, setShowGallery] = useState(false)

  // Auto-generate slug from title
  useEffect(() => {
    if (!initialData?.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      setFormData({...formData, slug})
    }
  }, [formData.title])

  const validateSlug = (slug: string) => {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    if (!validateSlug(formData.slug)) {
      toast({
        title: 'Invalid Slug',
        description: 'Slug can only contain lowercase letters, numbers and hyphens',
        variant: 'destructive'
      })
      setLoading(false)
      return
    }
    
    try {
      if (initialData?.id) {
        await ContentService.updatePost(initialData.id.toString(), formData)
        toast({
          title: 'Success',
          description: 'Post updated successfully',
        })
      } else {
        await ContentService.createPost(formData)
        toast({
          title: 'Success',
          description: 'Post created successfully',
        })
      }
      router.push('/admin/content/blog')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save post',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt (Optional)</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Featured Image</Label>
          {formData.imageUrl ? (
            <div className="relative group">
              <img 
                src={formData.imageUrl} 
                alt="Featured" 
                className="w-full h-48 object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white"
                  onClick={() => setShowGallery(true)}
                >
                  Change Image
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="border-2 border-dashed rounded-md p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
              onClick={() => setShowGallery(true)}
            >
              <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to select an image</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Content</Label>
          <BlogEditor 
            content={formData.content} 
            setContent={(content) => setFormData({...formData, content})}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <Label>Publishing</Label>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="publish-status" 
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => setFormData({...formData, isPublished: checked})}
                />
                <Label htmlFor="publish-status">
                  {formData.isPublished ? 'Published' : 'Draft'}
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => window.open(`/blog/preview/${formData.slug || 'temp'}`, '_blank')}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {initialData?.id ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </form>

      {showGallery && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Select Image</h2>
              <Button variant="ghost" onClick={() => setShowGallery(false)}>
                Close
              </Button>
            </div>
            <GalleryPicker onSelect={(url) => {
              setFormData({...formData, imageUrl: url})
              setShowGallery(false)
            }} />
          </div>
        </div>
      )}
    </div>
  )
}
