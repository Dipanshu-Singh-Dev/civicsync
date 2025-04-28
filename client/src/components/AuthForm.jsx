import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import LoadingButton from "./LoadingButton";

// Create a schema for our form
const createFormSchema = () => {
  return z.object({
    email: z
      .string()
      .min(3, { message: "Email must be at least 3 characters" })
      .max(50, { message: "Email must be less than 50 characters" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(100, { message: "Password must be less than 100 characters" })
  });
};

const AuthForm = ({
  title,
  description,
  submitButtonText,
  alternateActionText,
  alternateActionLink,
  onSubmit,
  isLoading = false
}) => {
  const navigate = useNavigate();
  const formSchema = createFormSchema();

  // Initialize react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleSubmit = (data) => {
    onSubmit(null, data);
  };

  return (
    <div className="flex items-center justify-center h-[80vh] bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoadingButton
                isLoading={isLoading}
                submitButtonText={submitButtonText}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate(alternateActionLink)}
            disabled={isLoading}
          >
            {alternateActionText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;
