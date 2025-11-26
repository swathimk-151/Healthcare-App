import { DoctorLayout } from "@/components/doctor-layout"
import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <DoctorLayout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        <Skeleton className="h-10 w-96 mb-6" />

        <Skeleton className="h-[500px] w-full mb-6" />
      </div>
    </DoctorLayout>
  )
}
