import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Crop, RotateCcw, Check, ZoomIn, Edit2, Loader2 } from "lucide-react";
import Cropper from "react-easy-crop";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { toast } from "sonner";

// Utility to create the cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: any,
  rotation = 0
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return "";
  }

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  // set each dimensions to double largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = safeArea;
  canvas.height = safeArea;

  // translate canvas context to a central location on canvas to allow rotating around the center.
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // draw rotated image and store data.
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image with correct offsets for x,y crop values.
  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  // Resize for storage optimization (max 800x800)
  const MAX_DIMENSION = 800;
  if (canvas.width > MAX_DIMENSION || canvas.height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / canvas.width, MAX_DIMENSION / canvas.height);
    const newWidth = canvas.width * ratio;
    const newHeight = canvas.height * ratio;

    const resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = newWidth;
    resizedCanvas.height = newHeight;
    const resizedCtx = resizedCanvas.getContext("2d");
    if (resizedCtx) {
      resizedCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
      return resizedCanvas.toDataURL("image/jpeg", 0.7);
    }
  }

  // As Base64 string (Compressed)
  return canvas.toDataURL("image/jpeg", 0.7);
}

export const compressImage = async (imageSrc: string): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const MAX_DIMENSION = 800;

  let width = image.width;
  let height = image.height;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    width *= ratio;
    height *= ratio;
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) return "";

  ctx.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.7);
};

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  maxSize?: number; // in MB
  aspectRatio?: number; // width/height
  showCrop?: boolean;
  showResize?: boolean;
  label?: string;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  maxSize = 10,
  aspectRatio = 16 / 9,
  showCrop = true,
  showResize = true,
  label = "Upload Image",
  placeholder = "Click to upload or drag & drop"
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(value || "");
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImage, setTempImage] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Crop State
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("শুধুমাত্র ছবি আপলোড করা যাবে");
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`ফাইল সাইজ ${maxSize}MB এর বেশি হতে পারবে না`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const result = reader.result as string;

      // Compress the image first
      const compressed = await compressImage(result);
      setTempImage(compressed);
      setPreviewUrl(compressed);

      // Reset crop state
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);

      // Show crop modal for editing
      if (showCrop) {
        setShowCropModal(true);
      } else {
        // If cropping is disabled, upload directly
        setIsUploading(true);
        try {
          const { uploadToCloudinary } = await import("../../utils/cloudinary");
          const cloudinaryUrl = await uploadToCloudinary(compressed);
          setPreviewUrl(cloudinaryUrl);
          onChange(cloudinaryUrl);
          toast.success("ছবি আপলোড সফল হয়েছে");
        } catch (error) {
          console.error("Cloudinary upload error:", error);
          toast.error("ছবি আপলোড করতে সমস্যা হয়েছে");
          onChange(compressed);
        } finally {
          setIsUploading(false);
        }
      }
    };
    reader.readAsDataURL(file);
  }, [maxSize, onChange, showCrop]);

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

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCrop = async () => {
    try {
      if (!tempImage || !croppedAreaPixels) return;

      setIsUploading(true);
      const croppedImage = await getCroppedImg(
        tempImage,
        croppedAreaPixels,
        rotation
      );

      setPreviewUrl(croppedImage);
      setShowCropModal(false);

      // Upload cropped image to Cloudinary
      try {
        const { uploadToCloudinary } = await import("../../utils/cloudinary");
        const cloudinaryUrl = await uploadToCloudinary(croppedImage);
        setPreviewUrl(cloudinaryUrl);
        onChange(cloudinaryUrl);
        toast.success("ছবি ক্রপ ও আপলোড সফল হয়েছে");
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        // Fallback to base64 if upload fails
        onChange(croppedImage);
        toast.success("ছবি ক্রপ সফল হয়েছে");
      }
    } catch (e) {
      console.error(e);
      toast.error("ছবি ক্রপ করতে সমস্যা হয়েছে");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl("");
    onChange("");
    setTempImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenEdit = () => {
    if (tempImage || previewUrl) {
      if (!tempImage && previewUrl) {
        setTempImage(previewUrl);
      }
      setShowCropModal(true);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-[#1A202C]">{label}</Label>}

      {/* Upload/Preview Area */}
      <div
        onClick={() => !previewUrl && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
          ${isDragging
            ? "border-[#285046] bg-[#285046]/5"
            : previewUrl
              ? "border-gray-200"
              : "border-gray-300 hover:border-[#285046] hover:bg-gray-50"
          }
          ${!previewUrl ? "p-8" : "p-0"}
        `}
      >
        {previewUrl ? (
          <div className="relative group">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            {/* Upload Loading Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <span className="text-sm">আপলোড হচ্ছে...</span>
              </div>
            )}
            {/* Overlay Actions */}
            <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 ${isUploading ? 'hidden' : ''}`}>
              <Button
                type="button"
                size="sm"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleOpenEdit();
                }}
                className="bg-white text-[#285046] hover:bg-gray-100"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                এডিট/ক্রপ
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={(e: React.MouseEvent) => {
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
                onClick={(e: React.MouseEvent) => {
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
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#285046] to-[#2F6057] rounded-2xl flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <p className="text-[#1A202C] mb-1">{placeholder}</p>
            <p className="text-sm text-[#555555] mb-2">
              JPG, PNG বা GIF (সর্বোচ্চ {maxSize}MB)
            </p>
            {aspectRatio && (
              <p className="text-xs text-[#555555]">
                Recommended ratio: {aspectRatio}:1
              </p>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Dedicated Crop Modal */}
      <Dialog open={showCropModal} onOpenChange={setShowCropModal}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 bg-[#1A202C] border-[#2D3748]" aria-describedby={undefined}>
          <DialogHeader className="p-4 border-b border-gray-800">
            <DialogTitle className="flex items-center gap-2 text-white">
              <Crop className="w-5 h-5" />
              ছবি এডিট করুন
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 relative min-h-[400px] bg-black">
            <Cropper
              image={tempImage}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>

          <div className="p-4 bg-[#1A202C] border-t border-gray-800 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1"><ZoomIn className="w-3 h-3" /> জুম</span>
                  <span>{Math.round(zoom * 100)}%</span>
                </div>
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.1}
                  onValueChange={(value: number[]) => setZoom(value[0])}
                  className="py-1"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1"><RotateCcw className="w-3 h-3" /> রোটেশন</span>
                  <span>{rotation}°</span>
                </div>
                <Slider
                  value={[rotation]}
                  min={0}
                  max={360}
                  step={1}
                  onValueChange={(value: number[]) => setRotation(value[0])}
                  className="py-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCropModal(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
              >
                বাতিল করুন
              </Button>
              <Button
                type="button"
                onClick={handleSaveCrop}
                className="bg-white text-black hover:bg-gray-200 min-w-[100px]"
              >
                <Check className="w-4 h-4 mr-2" />
                সেভ করুন
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}