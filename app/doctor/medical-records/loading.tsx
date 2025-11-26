import { DoctorLayout } from "@/components/doctor-layout"
import { Skeleton } from "@/components/ui/skeleton"

export default function MedicalRecordsLoading() {
  return (
    <DoctorLayout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[180px]" />
        </div>

        <Skeleton className="h-10 w-96 mb-6" />

        <Skeleton className="h-[400px] w-full mb-6" />
      </div>
    </DoctorLayout>
  )
}
