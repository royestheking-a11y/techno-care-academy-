import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, Image as ImageIcon, File, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Label } from "../ui/label";
import { toast } from "sonner";

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  fileType: "pdf" | "image" | "pptx";
  maxSize?: number; // in MB
  label?: string;
  placeholder?: string;
}

export function FileUpload({
  value,
  onChange,
  fileType,
  maxSize = 10,
  label = "ফাইল আপলোড করুন",
  placeholder = "ক্লিক করুন বা ড্র্যাগ করুন"
}: FileUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(value || "");
  const [fileName, setFileName] = useState<string>("");
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [tempFile, setTempFile] = useState<string>("");
  const [tempFileName, setTempFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptedTypes = () => {
    switch (fileType) {
      case "pdf":
        return "application/pdf";
      case "image":
        return "image/png,image/jpeg,image/jpg,image/svg+xml";
      case "pptx":
        return "application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation";
      default:
        return "*";
    }
  };

  const validateFile = (file: File): boolean => {
    // Validate file type
    const validTypes: { [key: string]: string[] } = {
      pdf: ["application/pdf"],
      image: ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"],
      pptx: [
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ]
    };

    if (!validTypes[fileType]?.includes(file.type)) {
      toast.error(`শুধুমাত্র ${fileType.toUpperCase()} ফাইল আপলোড করা যাবে`);
      return false;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`ফাইল সাইজ ${maxSize}MB এর বেশি হতে পারবে না`);
      return false;
    }

    return true;
  };

  // const [tempFileObj, setTempFileObj] = useState<File | null>(null); // Not needed for Base64

  const handleFileSelect = useCallback((file: File) => {
    if (!validateFile(file)) return;

    // setTempFileObj(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setTempFile(result);
      setTempFileName(file.name);
      setShowProcessModal(true);
    };
    reader.readAsDataURL(file);
  }, [fileType, maxSize]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleProcess = async () => {
    if (!tempFile) return;

    // Direct Base64 Storage (MongoDB)
    // No Cloudinary upload needed. content is already in tempFile (Base64)

    // For images, we can still optimize/resize using canvas before saving
    if (fileType === "image") {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = img.width;
        let height = img.height;
        const maxWidth = 1200;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const processedImage = canvas.toDataURL("image/jpeg", 0.9);

        setPreviewUrl(processedImage);
        setFileName(tempFileName);
        onChange(processedImage); // Save Base64 directly
        setShowProcessModal(false);
        setTempFile("");
        setTempFileName("");
        toast.success("ফাইল তৈরি হয়েছে (সেভ করতে 'আপডেট/যোগ' চাপুন)");
      };
      img.src = tempFile;
    } else {
      // PDF / PPTX - Use raw Base64
      setPreviewUrl(tempFile);
      setFileName(tempFileName);
      onChange(tempFile); // Save Base64 directly
      setShowProcessModal(false);
      setTempFile("");
      setTempFileName("");
      toast.success("ফাইল তৈরি হয়েছে (সেভ করতে 'আপডেট/যোগ' চাপুন)");
    }
  };

  const handleRemove = () => {
    setPreviewUrl("");
    setFileName("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = () => {
    switch (fileType) {
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />;
      case "image":
        return <ImageIcon className="w-8 h-8 text-blue-500" />;
      case "pptx":
        return <File className="w-8 h-8 text-orange-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const getFileTypeLabel = () => {
    switch (fileType) {
      case "pdf":
        return "PDF";
      case "image":
        return "ছবি (PNG, JPG, SVG)";
      case "pptx":
        return "PowerPoint";
      default:
        return "ফাইল";
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-[#1A202C]">{label}</Label>}

      {/* Upload Area */}
      <div
        onClick={() => !previewUrl && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative rounded-xl border-2 border-dashed transition-all cursor-pointer
          ${isDragging
            ? "border-[#285046] bg-[#285046]/5"
            : previewUrl
              ? "border-gray-200"
              : "border-gray-300 hover:border-[#285046] hover:bg-gray-50"
          }
          ${!previewUrl ? "p-8" : "p-4"}
        `}
      >
        {previewUrl ? (
          <div className="relative">
            {fileType === "image" ? (
              <div className="relative group">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="bg-white text-[#285046] hover:bg-gray-100"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    পরিবর্তন
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove();
                    }}
                  >
                    <X className="w-4 h-4 mr-1" />
                    মুছুন
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getFileIcon()}
                  <div>
                    <p className="text-sm text-[#1A202C] truncate max-w-xs">{fileName}</p>
                    <p className="text-xs text-[#555555]">{getFileTypeLabel()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="bg-[#285046] text-white hover:bg-[#2F6057]"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    পরিবর্তন
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove();
                    }}
                  >
                    <X className="w-4 h-4 mr-1" />
                    মুছুন
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#285046] to-[#2F6057] rounded-2xl flex items-center justify-center mb-4">
              {getFileIcon()}
            </div>
            <p className="text-[#1A202C] mb-1">{placeholder}</p>
            <p className="text-sm text-[#555555] mb-2">
              {getFileTypeLabel()} (সর্বোচ্চ {maxSize}MB)
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptedTypes()}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Process Modal */}
      <Dialog open={showProcessModal} onOpenChange={setShowProcessModal}>
        <DialogContent className="sm:max-w-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getFileIcon()}
              ফাইল প্রসেস করুন
            </DialogTitle>
          </DialogHeader>

          {tempFile && (
            <div className="space-y-4">
              {fileType === "image" ? (
                <div className="relative bg-gray-100 rounded-xl p-4 flex items-center justify-center max-h-96 overflow-hidden">
                  <img
                    src={tempFile}
                    alt="Preview"
                    className="max-w-full max-h-80 object-contain"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl">
                  {getFileIcon()}
                  <div>
                    <p className="text-[#1A202C]">{tempFileName}</p>
                    <p className="text-sm text-[#555555]">{getFileTypeLabel()}</p>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm text-[#1A202C] mb-1">প্রসেসিং তথ্য</h4>
                    <ul className="text-xs text-[#555555] space-y-1">
                      {fileType === "image" && <li>• Auto-resize to max 1200px width</li>}
                      {fileType === "image" && <li>• Optimized quality (90%)</li>}
                      <li>• ফাইল টাইপ: {getFileTypeLabel()}</li>
                      <li>• আপলোড হচ্ছে: {tempFileName}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowProcessModal(false);
                setTempFile("");
                setTempFileName("");
              }}
            >
              বাতিল
            </Button>
            <Button
              type="button"
              onClick={handleProcess}
              className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046]"
            >
              <Check className="w-4 h-4 mr-2" />
              আপলোড করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
