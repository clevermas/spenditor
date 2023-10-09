import { CreateTransactionModal } from "@/components/modals/create-transaction-modal";
import { EditTransactionModal } from "@/components/modals/edit-transaction-modal";

export default function Layout({ children }) {
  return (
    <>
      {children}
      <CreateTransactionModal></CreateTransactionModal>
      <EditTransactionModal></EditTransactionModal>
    </>
  );
}
