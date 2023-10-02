"use client";

import { Pen } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { BlogColumn, columns } from "./columns";

interface BlogClientProps {
  data: BlogColumn[];
};

export const BlogClient: React.FC<BlogClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <> 
      <div className="flex items-center justify-between gap-4">
        <Heading title={`Posts (${data.length})`} description="Write and publish blog posts to your store." />
        <Button onClick={() => router.push(`/${params.storeId}/blog/new`)}>
          <Pen className="mr-2 h-4 w-4" /> Write
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
