export default function DashboardSkeleton() {  
  return (  
    <div className="min-h-screen bg-gray-50 p-8">  
      <div className="max-w-6xl mx-auto">  
        <div className="mb-8">  
          <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>  
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>  
        </div>

        {/* Safe Harbor Status Skeleton */}  
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">  
          <div className="flex items-center justify-between">  
            <div>  
              <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>  
              <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>  
            </div>  
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>  
          </div>  
        </div>

        {/* Successors Skeleton */}  
        <div className="bg-white rounded-lg border border-gray-200 p-6">  
          <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>  
          <div className="flex flex-col gap-3">  
            <div className="h-16 bg-gray-200 rounded animate-pulse"></div>  
            <div className="h-16 bg-gray-200 rounded animate-pulse"></div>  
          </div>  
        </div>

        <p className="text-center text-gray-600 mt-8">Checking Certainty...</p>  
      </div>  
    </div>  
  )  
}  
