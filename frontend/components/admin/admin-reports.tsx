"use client"

import { DashboardStats } from "@/components/admin/dashboard-stats"
import { ActivityChart } from "@/components/charts/activity-chart"
import { EnrollmentChart } from "@/components/charts/enrollment-chart"
import { RecentActivities } from "@/components/admin/recent-activities"
import { PerformanceOverview } from "@/components/admin/performance-overview"

export default function AdminReports() {
  return (
    <div className="space-y-6">
        <DashboardStats />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityChart />
          <EnrollmentChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivities />
          <PerformanceOverview />
        </div>
      </div>
  )
}
