import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TransactionClass } from "@/db/transaction";
import { open } from "@/redux/features/modal.slice";
import { useAppDispatch } from "@/redux/hooks";
import { MoreVertical } from "lucide-react";

export function DataTableActions({ data }: { data: TransactionClass }) {
  const dispatch = useAppDispatch();

  function openEditTransactionModal() {
    dispatch(open({ type: "editTransaction", data }));
  }

  function openRemoveTransactionModal() {
    dispatch(
      open({ type: "removeTransaction", data: { transactionId: data?._id } })
    );
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-7 h-7 p-1" aria-label="actions">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={openEditTransactionModal}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openRemoveTransactionModal}>
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
