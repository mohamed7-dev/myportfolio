import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export function StyledUploadDropzone(
  props: React.ComponentProps<typeof UploadDropzone>,
) {
  return (
    <UploadDropzone
      {...props}
      className="ut-button:h-10 ut-button:bg-primary ut-button:ut-readying:bg-primary/70 ut-button:ut-uploading:bg-primary ut-button:text-primary-foreground ut-button:border-2 ut-button:border-border ut-button:rounded-base ut-button:text-sm ut-button:tracking-widest ut-button:whitespace-nowrap ut-button:uppercase ut-button:font-base ut-button:shadow-default ut-button:hover:shadow-none ut-button:hover:translate-x-box-shadow-x ut-button:hover:translate-y-box-shadow-y ut-button:ring-offset-white ut-button:transition-all ut-button:outline-none ut-button:select-none  ut-button:focus-visible:ring-2 ut-button:focus-visible:ring-ring ut-button:focus-visible:ring-offset-2 ut-button:[&_svg]:pointer-events-none ut-button:[&_svg]:shrink-0 ut-button:[&_svg:not([class*='size-'])]:size-4 ut-allowed-content:text-foreground ut-allowed-content:font-base ut-allowed-content:text-sm ut-label:text-foreground ut-label:text-lg ut-label:w-fit ut-upload-icon:text-foreground ut-ready:border-solid ut-ready:border-border ut-ready:border-2 ut-readying:border-solid ut-readying:border-border ut-readying:border-2 ut-uploading:border-solid ut-uploading:border-primary ut-uploading:border-2"
    />
  );
}
