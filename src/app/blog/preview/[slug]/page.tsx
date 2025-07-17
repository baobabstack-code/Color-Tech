"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ContentService } from "@/services/content";

export default function BlogPreview() {
  const params = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!params?.slug) {
        setLoading(false);
        return;
      }

      try {
        // Temporary preview endpoint - replace with actual preview API
        const posts = await ContentService.getPosts();
        const previewPost =
          posts.find((p: any) => p.slug === params.slug) || posts[0];
        setPost(previewPost);
      } catch (error) {
        console.error("Preview error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold text-center">
          Preview not available
        </h1>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <article className="prose lg:prose-xl mx-auto">
        {post.imageUrl && (
          <div className="mb-8">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
        <p className="text-yellow-700">
          This is a preview. Changes are not published yet.
        </p>
      </div>
    </div>
  );
}
