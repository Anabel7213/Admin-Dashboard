"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Inquiry } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import formatPhoneNumber from "@/lib/formatPhone";
import React from "react";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().min(1),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
  status: z.string().min(1),
});

type InquiryFormValues = z.infer<typeof formSchema>;

interface InquiryFormProps {
  initialData: Inquiry | null;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = "Update inquiry"
  const description = "Update inquiry and manage status."
  const toastMessage = "Inquiry Updated"
  const action = "Save Changes"

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      status: ""
    },
  });

  const onSubmit = async (data: InquiryFormValues) => {
    try {
      setLoading(true);
      console.log(data)
      await axios.patch(`/api/${params.storeId}/inquiries/${params.inquiryId}`, data);
      router.refresh();
      router.push(`/${params.storeId}/inquiries`);
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
      await axios.delete(`/api/${params.storeId}/inquiries/${params.inquiryId}`);
      router.refresh();
      router.push(`/${params.storeId}/inquiries`);
      toast.success("Inquiry deleted.");
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
          <div className="flex flex-col lg:flex-nowrap sm:flex-wrap lg:gap-8 sm:gap-4">
            <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="sm:w-full lg:w-fit">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Joe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="sm:w-full lg:w-fit">
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <SelectTrigger className="lg:w-[180px] sm:w-full">
                          <SelectValue placeholder="New" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Received">Received</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="sm:w-full lg:w-fit">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="example@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="sm:w-full lg:w-fit">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="(000) 000-0000"
                        {...field}
                        onChange={(e) => {
                          const formattedPhone = formatPhoneNumber(
                            e.target.value
                          );
                          field.onChange(formattedPhone);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              <Separator />
              <div className="flex gap-4 flex-col">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className="lg:w-[382px] sm:w-full">
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Item was not delivered"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea disabled={loading} {...field} className="resize-none h-[164px]"/>
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