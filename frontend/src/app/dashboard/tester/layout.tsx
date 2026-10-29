import { DashboardLayout } from "@/components/DashboardLayout";

export default function TesterDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="tester">{children}</DashboardLayout>;
}
