"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Review } from "@prisma/client";
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
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@mui/material";

const formSchema = z.object({
  name: z.string().min(1),
  content: z.string().optional(),
  rating: z.coerce.number().min(1),
  productName: z.string().min(1),
  productId: z.string().min(1),
  response: z.string().max(400),
});

type ReviewFormValues = z.infer<typeof formSchema>;

interface ReviewFormProps {
  initialData: Review | null;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = "Respond to review"
  const description = "Send a response to a customer's review. All responses will be publicly visible."
  const toastMessage = "Response published"
  const action = "Respond"

  const defaultValues = initialData ? 
      {
        ...initialData,
        rating: parseFloat(String(initialData?.rating)),
      }
    :
      {
        name: "",
        content: "",
        rating: 0,
        response: "",
        productName: "",
        productId: ""
      }

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ReviewFormValues) => {
    try {
      setLoading(true);
      console.log(data)
      await axios.patch(`/api/${params.storeId}/reviews/${params.reviewId}`, data);
      router.refresh();
      router.push(`/${params.storeId}/reviews`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/reviews/${params.reviewId}`);
      router.refresh();
      router.push(`/${params.storeId}/reviews`);
      toast.success("Review deleted.");
    } catch (error: any) {
      toast.error("Please try again.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="flex flex-col lg:flex-nowrap sm:flex-wrap gap-4">
            <div className="flex flex-col gap-4">
              <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col gap-2">
                      <FormControl className="flex items-center gap-2">
                      <Rating name="read-only" value={field.value} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="sm:w-full lg:w-fit">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          readOnly
                          placeholder="Joe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-4 flex-col">
              <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="lg:w-[382px] sm:w-full">
                      <FormLabel>Customer Review</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled
                          className="resize-none h-[164px]"
                          readOnly
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="response"
                  render={({ field }) => (
                    <FormItem className="lg:w-[382px] sm:w-full">
                      <FormLabel>Store Response</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none h-[164px]"
                          disabled={loading}
                          placeholder="Write your response..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};