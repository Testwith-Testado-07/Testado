import { CreditCard } from "lucide-react";

import { EmptyState } from "@/components/dashboard/EmptyState";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function BillingPage() {
  return (
    <>
      <PageHeader title="Billing" description="Payments and campaign funding are not connected yet." />

      <div className="max-w-2xl">
        <EmptyState
          icon={CreditCard}
          title="Payment processing is not enabled"
          description="No payment provider or transaction ledger is connected. Campaign reward amounts are planning estimates only; they are not deposits, escrow balances, or completed payments."
        />
      </div>
    </>
  );
}
