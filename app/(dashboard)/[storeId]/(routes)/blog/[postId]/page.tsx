import prismadb from "@/lib/prismadb";

import { BlogForm } from "./components/blog-form";

const BlogPage = async ({
  params
}: {
  params: { postId: string, storeId: string }
}) => {
  const post = await prismadb.blog.findUnique({
    where: {
      id: params.postId,
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BlogForm initialData={post} />
      </div>
    </div>
  );
}

export default BlogPage;
