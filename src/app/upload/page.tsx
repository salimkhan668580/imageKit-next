import FileUpload from "@/components/FileUpload"
import { metadata } from "../layout"


function page() {
  metadata.title="Upload"
  return (
    <FileUpload/>
  )
}

export default page