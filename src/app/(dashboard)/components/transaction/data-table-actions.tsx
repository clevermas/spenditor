import { EditTransactionModal } from "@/components/modals/edit-transaction-modal";
import { RemoveTransactionModal } from "@/components/modals/remove-transaction-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TransactionClass } from "@/db/transaction";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

export function DataTableActions({ data }: { data: TransactionClass }) {
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false);
  const [isRemoveTransactionOpen, setIsRemoveTransactionOpen] = useState(false);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-7 h-7 p-1" aria-label="actions">
            <MoreVertical size={16} strokeWidth={2} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setIsEditTransactionOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsRemoveTransactionOpen(true)}>
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <EditTransactionModal 
        data={data} 
        open={isEditTransactionOpen}
        onClose={() => setIsEditTransactionOpen(false)}
      />
      
      <RemoveTransactionModal
        data={{ transactionId: data?._id ?? '' }} 
        open={isRemoveTransactionOpen}
        onClose={() => setIsRemoveTransactionOpen(false)}
      />
    </div>
  );
}
