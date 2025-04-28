import React from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem
} from "@/components/ui/select";
import { FileInput } from "@/components/FileInput";
import LoadingButton from "./LoadingButton";
const CreateIssueForm = ({ form, onSubmit, loading }) => {
  return (
    <Form {...form} className="w-full">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Pothole on the road" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief description of the issue"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ROAD">Road</SelectItem>
                      <SelectItem value="PARK">Park</SelectItem>
                      <SelectItem value="PARKING">Parking</SelectItem>
                      <SelectItem value="LIBRARY">Library</SelectItem>
                      <SelectItem value="INFRASTRUCTURE">
                        Infrastructure
                      </SelectItem>
                      <SelectItem value="SAFETY">Safety</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAYUR_VIHAR">Mayur Vihar</SelectItem>
                      <SelectItem value="KANHAIYA_NAGAR">
                        Kanhaiya Nagar
                      </SelectItem>
                      <SelectItem value="MANSAROVAR_PARK">
                        Mansarovar Park
                      </SelectItem>
                      <SelectItem value="GTB_NAGAR">Gtb Nagar</SelectItem>
                      <SelectItem value="KIRTI_NAGAR">Kirti Nagar</SelectItem>
                      <SelectItem value="SHAHDARA">Shahdara</SelectItem>
                      <SelectItem value="KASHMERE_GATE">
                        Kashmere Gate
                      </SelectItem>
                      <SelectItem value="BURARI">Burari</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FileInput number={1} />
          <FileInput number={2} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FileInput number={3} />
        </div>
        <LoadingButton isLoading={loading} submitButtonText={"Create Issue"} />
      </form>
    </Form>
  );
};

export default CreateIssueForm;
