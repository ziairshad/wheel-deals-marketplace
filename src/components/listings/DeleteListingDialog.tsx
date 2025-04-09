
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteListingDialog = ({
  open,
  onOpenChange,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteListingDialogProps) => {
  // Simplified handler for confirmation - no unnecessary preventDefault
  const handleConfirm = () => {
    onConfirm();
  };

  // Handle open state changes properly
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isDeleting) {
      onClose(); // Only call onClose when actually closing and not deleting
    }
    onOpenChange(newOpen); // Always update the parent state
  };

  return (
    <AlertDialog 
      open={open} 
      onOpenChange={handleOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this car listing. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onClose} 
            disabled={isDeleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteListingDialog;
