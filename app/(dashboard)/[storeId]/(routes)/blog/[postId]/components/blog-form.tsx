"use client";

import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Blog } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/datePicker";
import { AlignCenter, AlignLeft, AlignRight, Bold, Heading1, Heading2, Heading3, ImageIcon, Italic, LinkIcon, Underline } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(1),
  date: z.date(),
  content: z.string().min(1),
  imageUrl: z.string().min(1),
  isPublished: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type BlogFormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  initialData: Blog | null;
}

export const BlogForm: React.FC<BlogFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const toastMessage = initialData
    ? "Post updated."
    : "Successfully published.";
  const action = initialData ? "Save changes" : "Publish";

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      date: undefined,
      content: "",
      imageUrl: "",
      isPublished: false,
      isArchived: false,
    },
  });

  const onSubmit = async (data: BlogFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/blog/${params.postId}`, data);
      } else {
        const response = await axios.post(`/api/${params.storeId}/blog`, data);
        console.log(response.data);
      }
      router.refresh();
      router.push(`/${params.storeId}/blog`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const [ bold, setBold ] = useState(false)
  const [ italic, setItalic ] = useState(false)
  const [ underline, setUnderline ] = useState(false)
  const [ leftAlign, setLeftAlign ] = useState(false)
  const [ centerAlign, setCenterAlign ] = useState(false)
  const [ rightAlign, setRightAlign ] = useState(false)
  const [ headerOne, setHeaderOne ] = useState(false)
  const [ headerTwo, setHeaderTwo ] = useState(false)
  const [ headerThree, setHeaderThree ] = useState(false)
  const [ image, setImage ] = useState(false)
  const [ link, setLink ] = useState(false)

  const [ output, setOutput ] = useState("")
  const [ linkUrl, setLinkUrl ] = useState("")
  const handleLinkClick = () => {
    window.location.href = linkUrl;
  }

  const handleStyle = () => {
    try {
      if(bold) {
        setOutput("resize-none h-full font-bold")
      } 
      else if(italic) {
        setOutput("resize-none h-full italic")
      }
      else if(underline) {
        setOutput("resize-none h-full underline")
      }
      else if(leftAlign) {
        setOutput("resize-none h-full text-start")
      }
      else if(centerAlign) {
        setOutput("resize-none h-full text-center")
      }
      else if(rightAlign) {
        setOutput("resize-none h-full text-end")
      }
      else if(headerOne) {
        setOutput("resize-none h-full text-4xl")
      }
      else if(headerTwo) {
        setOutput("resize-none h-full text-2xl")
      }
      else if(headerThree) {
        setOutput("resize-none h-full text-xl")
      }
      else if(image) {
        setOutput("resize-none h-full")
      }
      else if(link) {
        setOutput("resize-none h-full")
        setLinkUrl("www.google.com")
      }
      else {
        setOutput("resize-none h-full")
      }
    } catch(err) {
      if(err) throw err
    }
  }
  useEffect(() => {
    handleStyle()
  })

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="border w-full h-[200px] rounded-lg overflow-hidden">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      width="w-full"
                      buttonStyle="flex justify-end mr-4"
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DatePicker date={field.value} setDate={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between lg:flex-nowrap sm:flex-wrap gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 w-full justify-end">
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border lg:w-fit sm:w-full lg:p-3 sm:p-4 h-fit">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          // @ts-ignore
                          onCheckedChange={field.onChange}
                          onClick={() => console.log(field.value)} //i just cant get where it's coming from but it's false when it's checked like wtf
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Published</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isArchived"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border lg:w-fit sm:w-full lg:p-3 sm:p-4 h-fit">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          // @ts-ignore
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Archived</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex sm:gap-2 lg:gap-8 border p-2 rounded-lg sm:flex-wrap lg:flex-nowrap">
              <div className="flex lg:gap-4 sm:gap-2">
                <div className={bold ? "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-inner text-slate-400" : "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-sm"} onClick={() => setBold(bold => !bold)}><Bold size={16} /></div>
                <div className={italic ? "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-inner text-slate-400" : "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-sm"} onClick={() => setItalic(italic => !italic)}><Italic size={16} /></div>
                <div className={underline ? "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-inner text-slate-400" : "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-sm"} onClick={() => setUnderline(underline => !underline)}><Underline size={16} /></div>
              </div>
              <div className="flex lg:gap-4 sm:gap-2">
                <div className={leftAlign ? "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-inner text-slate-400" : "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-sm"} onClick={() => setLeftAlign(leftAlign => !leftAlign)}><AlignLeft size={16} /></div>
                <div className={centerAlign ? "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-inner text-slate-400" : "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-sm"} onClick={() => setCenterAlign(centerAlign => !centerAlign)}><AlignCenter size={16} /></div>
                <div className={rightAlign ? "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-inner text-slate-400" : "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-sm"} onClick={() => setRightAlign(rightAlign => !rightAlign)}><AlignRight size={16} /></div>
              </div>
              <div className="flex lg:gap-4 sm:gap-2">
                <div className={headerOne ? "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-inner text-slate-400" : "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-sm"} onClick={() => setHeaderOne(headerOne => !headerOne)}><Heading1 size={16} /></div>
                <div className={headerTwo ? "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-inner text-slate-400" : "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-sm"} onClick={() => setHeaderTwo(headerTwo => !headerTwo)}><Heading2 size={16} /></div>
                <div className={headerThree ? "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-inner text-slate-400" : "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-sm"} onClick={() => setHeaderThree(headerThree => !headerThree)}><Heading3 size={16} /></div>
              </div>
              <div className="flex lg:gap-4 sm:gap-2">
                <div className={image ? "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-inner text-slate-400" : "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-sm"} onClick={() => setImage(image => !image)}><ImageIcon size={16} /></div>
                <div className={link ? "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-inner text-slate-400" : "p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-sm"} onClick={() => setLink(link => !link)}><LinkIcon size={16} /></div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full mb-6 mt-0 h-[264px]">
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Start writing..."
                      {...field}
                      className={output}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};