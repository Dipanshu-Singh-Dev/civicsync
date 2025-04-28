import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import CreateIssueForm from "@/components/CreateIssueForm";
import { createIssue } from "@/services/issue.service";
// Define Zod schema for issue creation
const issueSchema = z
  .object({
    title: z
      .string()
      .min(3, { message: "Title is required & must be at least 3 characters" })
      .max(50, {
        message: "Title must be at most 50 characters"
      }),
    description: z
      .string()
      .min(20, {
        message: "Description is required & must be at least 20 characters"
      })
      .max(200, {
        message: "Description must be at most 200 characters"
      }),
    type: z.enum(["Private", "Public"], { message: "Issue type is required" }),
    startTime: z.string().nonempty({ message: "Start time is required" }),
    endTime: z.string().nonempty({ message: "End time is required" }),
    maxParticipants: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Number(val) && Number(val) < 1), {
        message: "Must be a number higher than 1"
      })
      .transform((val) => (val ? Number(val) : undefined)),
    tag: z.enum(["Hangout", "Work", "Brainstorm", "Wellness"], {
      message: "Tag is required"
    })
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: "End time must be after start time",
    path: ["endTime"]
  });

const CreateIssue = () => {
  const form = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "Public",
      startTime: "",
      endTime: "",
      maxParticipants: "",
      tag: "Hangout"
    }
  });

  const onSubmit = async (data) => {
    try {
      const issue = await createIssue(data);
      console.log("Issue created:", issue);
      toast.success({
        title: "Issue created successfully"
      });
    } catch (error) {
      console.error("Error creating issue:", error);
      toast.error({
        title: "Error creating issue"
      });
    }
  };

  return (
    <div className="max-w-xl p-12">
      <CreateIssueForm form={form} onSubmit={onSubmit} />
    </div>
  );
};

export default CreateIssue;
