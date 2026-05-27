import { LoaderIcon } from "lucide-react"

const Loading = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
        <LoaderIcon className="animate-spin text-primary-main size-16" />
    </div>
  )
}

export default Loading