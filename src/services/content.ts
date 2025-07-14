import { API_URL } from '@/lib/constants'

export const ContentService = {
  // Blog Posts
  async getPosts() {
    const response = await fetch(`${API_URL}/posts`)
    return await response.json()
  },
  
  async getPost(id: string) {
    const response = await fetch(`${API_URL}/posts/${id}`)
    return await response.json()
  },

  async createPost(data: {
    title: string
    content: string
    excerpt?: string
    imageUrl?: string
    isPublished?: boolean
    slug: string
  }) {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return await response.json()
  },

  async updatePost(id: string, data: {
    title?: string
    content?: string
    excerpt?: string
    imageUrl?: string
    isPublished?: boolean
    slug?: string
  }) {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return await response.json()
  },

  async publishPost(id: string) {
    const response = await fetch(`${API_URL}/posts/${id}/publish`, {
      method: 'POST'
    })
    return await response.json()
  },

  async deletePost(id: string) {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE'
    })
    return await response.json()
  },

  // Media
  async uploadImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${API_URL}/media`, {
      method: 'POST',
      body: formData
    })
    return await response.json()
  },

  async getGallery() {
    const response = await fetch(`${API_URL}/media`)
    return await response.json()
  },

  async deleteMedia(id: string) {
    const response = await fetch(`${API_URL}/media/${id}`, {
      method: 'DELETE'
    })
    return await response.json()
  }
}
