import { useQueryClient } from "@tanstack/react-query";
import { useGetMessages, useCreateMessage, getGetMessagesQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function useGuestbookMessages() {
  return useGetMessages({
    request: { credentials: "omit" } // Simple public API, no auth needed for this specific feature yet
  });
}

export function useAddGuestbookMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useCreateMessage({
    mutation: {
      onSuccess: () => {
        // Invalidate the messages query to fetch the new list immediately
        queryClient.invalidateQueries({ queryKey: getGetMessagesQueryKey() });
        toast({
          title: "Message submitted",
          description: "Thank you for signing our guestbook.",
        });
      },
      onError: (error) => {
        console.error("Failed to submit message:", error);
        toast({
          variant: "destructive",
          title: "Submission failed",
          description: "There was a problem submitting your message. Please try again.",
        });
      }
    }
  });
}
