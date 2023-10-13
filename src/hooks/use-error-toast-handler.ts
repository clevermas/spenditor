import { useEffect } from "react";

import { useToast } from "@/components/ui/use-toast";

export const useErrorToastHandler = (error) => {
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: error?.data?.name,
      });
    }
  }, [error, toast]);
};
