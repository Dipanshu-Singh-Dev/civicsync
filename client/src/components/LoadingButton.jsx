import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function LoadingButton({ isLoading, submitButtonText }) {
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        submitButtonText
      )}
    </Button>
  );
}

export default LoadingButton;
