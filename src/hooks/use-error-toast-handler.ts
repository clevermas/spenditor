import { useEffect } from "react";
import { toast } from "sonner";

export const useErrorToastHandler = (error) => {

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong", {
        description: error?.data?.name,
      });
    }
  }, [error, toast]);
};
