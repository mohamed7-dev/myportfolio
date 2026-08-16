import type { FileRejection } from "react-dropzone";

export const handleDropZoneRejections = (rejectedFiles: FileRejection[]) => {
  const errors: string[] = [];
  rejectedFiles.forEach((file) => {
    if (file.errors[0].code === "file-too-large") {
      errors.push("File is too large");
    } else if (file.errors[0].code === "file-invalid-type") {
      errors.push("Invalid file type");
    }
  });
  return errors;
};
