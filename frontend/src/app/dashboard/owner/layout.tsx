import { DashboardLayout } from "@/components/DashboardLayout";

export default function OwnerDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="owner">{children}</DashboardLayout>;
}
