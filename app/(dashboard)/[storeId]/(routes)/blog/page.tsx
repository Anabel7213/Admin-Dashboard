import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { BlogClient } from "./components/client";
import { BlogColumn } from "./components/columns";

const BlogPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const posts = await prismadb.blog.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedPosts: BlogColumn[] = posts.map((post) => ({
    id: post.id,
    date: format(post.date, 'MMMM do, yyyy'),
    name: post.name,
    isPublished: post.isPublished,
    isArchived: post.isArchived,
    createdAt: format(post.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BlogClient data={formattedPosts} />
      </div>
    </div>
  );
};

export default BlogPage;
