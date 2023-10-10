import { AddTransactionModal } from "@/components/modals/add-transaction-modal";
import { EditTransactionModal } from "@/components/modals/edit-transaction-modal";
import { RemoveTransactionModal } from "@/components/modals/remove-transaction-modal";

export default function Layout({ children }) {
  return (
    <>
      {children}
      <>
        <AddTransactionModal></AddTransactionModal>
        <EditTransactionModal></EditTransactionModal>
        <RemoveTransactionModal></RemoveTransactionModal>
      </>
    </>
  );
}
