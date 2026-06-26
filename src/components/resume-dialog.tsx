"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { resume } from "@/data/resume";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

const id = resume.identity.resumeFileId;
const driveUrl = `https://drive.google.com/file/d/${id}/view`;
const previewUrl = `https://drive.google.com/file/d/${id}/preview`;
const downloadUrl = `https://drive.google.com/uc?export=download&id=${id}`;

export function ResumeDialog() {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "Resume_Putu Wisnu Wirayuda Putra.pdf";
    link.click();

    const toastId = toast.info(
      <p className="ml-4 text-muted-foreground text-sm ">
        Resume not downloading? Use{" "}
        <a
          href={driveUrl}
          target="_blank"
          className="text-primary underline underline-offset-2"
          onClick={() => toast.dismiss(toastId)}
        >
          this link
        </a>
      </p>,
      {
        duration: Infinity,
        closeButton: true,
        position: "top-center",
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger
        render={<Button size="lg" variant="outline" className="rounded-full" />}
      >
        <FileText className="size-4" />
        Resume
      </DialogTrigger>
      <DialogContent className="flex md:min-h-[85vh] min-h-full min-w-full md:min-w-[80vw] flex-col gap-0 overflow-hidden p-0 rounded-none md:rounded-3xl">
        <div className="flex items-center justify-between border-b border-border py-3 pr-14 pl-5">
          <DialogTitle>Resume</DialogTitle>
          <Button
            size="sm"
            variant="outline"
            nativeButton={false}
            className="rounded-full"
            onClick={handleDownload}
          >
            <Download className="size-3.5" />
            Download
          </Button>
        </div>
        <iframe
          src={previewUrl}
          title="Resume — Putu Wisnu Wirayuda Putra"
          className="w-full flex-1 border-0"
          allow="autoplay"
        />
      </DialogContent>
    </Dialog>
  );
}
