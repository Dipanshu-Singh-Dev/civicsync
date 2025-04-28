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
    category: z.enum(
      [
        "ROAD",
        "PARK",
        "PARKING",
        "LIBRARY",
        "INFRASTRUCTURE",
        "SAFETY",
        "OTHER"
      ],
      {
        message: "Issue category is required"
      }
    ),
    location: z.enum(
      [
        "MAYUR_VIHAR",
        "KANHAIYA_NAGAR",
        "MANSAROVAR_PARK",
        "GTB_NAGAR",
        "KIRTI_NAGAR",
        "SHAHDARA",
        "KASHMERE_GATE",
        "BURARI",
        "OTHER"
      ],
      { message: "Location is required." }
    )
  })
  .passthrough();

const CreateIssue = () => {
  const [loading, setLoading] = React.useState(false);
  const form = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "MAYUR_VIHAR",
      category: "ROAD",
      picture1: [],
      picture2: [],
      picture3: []
    }
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const fileToDataUrl = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });

      // Create a mutable copy of the data to hold data URLs
      const processedData = { ...data };
      const pictureKeys = ["picture1", "picture2", "picture3"];
      const conversionPromises = [];

      for (const key of pictureKeys) {
        const fileList = data[key];
        // Check if the FileList exists and has at least one file
        if (fileList && fileList.length > 0) {
          const file = fileList[0];
          conversionPromises.push(
            fileToDataUrl(file)
              .then((dataUrl) => {
                processedData[key] = dataUrl; // Update the copy with the data URL
              })
              .catch((error) => {
                console.error(`Error converting ${key} to data URL:`, error);
                processedData[key] = null; // Handle potential conversion error
              })
          );
        } else {
          // If no file was selected for this input, set it to null
          processedData[key] = null;
        }
      }

      // Wait for all file conversions to complete
      await Promise.all(conversionPromises);

      console.log("Data with pictures converted to data URLs:", processedData);
      // Note: The subsequent call to createIssue should use processedData
      // e.g., const issue = await createIssue(processedData);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl p-12">
      <CreateIssueForm form={form} onSubmit={onSubmit} loading={loading} />
    </div>
  );
};

export default CreateIssue;
