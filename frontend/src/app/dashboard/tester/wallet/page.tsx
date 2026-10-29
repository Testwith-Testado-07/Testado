import { Wallet } from "lucide-react";

import { EmptyState } from "@/components/dashboard/EmptyState";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function TesterWallet() {
  return (
    <>
      <PageHeader title="Wallet" description="Payouts and earnings will appear here when payment processing is available." />

      <div className="max-w-2xl">
        <EmptyState
          icon={Wallet}
          title="Payouts are not enabled yet"
          description="Testado has not connected a payment provider, so there is no withdrawable balance or transaction history to show. We will display payment details here once payouts are implemented."
        />
      </div>
    </>
  );
}
