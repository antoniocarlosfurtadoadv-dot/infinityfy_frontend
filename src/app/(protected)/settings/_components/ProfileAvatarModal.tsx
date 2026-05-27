"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Pencil } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { CancelButton } from "@/components/ui/CancelButton";
import { useUploadProfilePhoto } from "../_hooks/useUploadProfilePhoto";
import { useUpdateProfile } from "../_hooks/useUpdateProfile";
import { getCroppedImageFile } from "../_utils/cropImage";

type Step = "idle" | "crop" | "preview" | "firstUpload";

interface IProfileAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  imageUrl?: string | null;
}

export function ProfileAvatarModal({
  isOpen,
  onClose,
  name,
  imageUrl,
}: IProfileAvatarModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { execute: uploadPhoto, isLoading: isUploading } =
    useUploadProfilePhoto();
  const { execute: updateProfile, isLoading: isRemoving } = useUpdateProfile();
  const isLoading = isUploading || isRemoving;

  const [step, setStep] = useState<Step>("idle");
  // raw object URL of the original selected file (used by Cropper)
  const [rawUrl, setRawUrl] = useState<string | null>(null);
  // cropped File + preview URL
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // original file name for the output File
  const [originalName, setOriginalName] = useState("photo.jpg");

  // crop state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  // Reset everything when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (!imageUrl) {
        setStep("firstUpload");
      } else {
        setStep("idle");
      }
      if (rawUrl) URL.revokeObjectURL(rawUrl);
      setRawUrl(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setCroppedFile(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function handleEditClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (rawUrl) URL.revokeObjectURL(rawUrl);
    setRawUrl(URL.createObjectURL(selected));
    setOriginalName(selected.name);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setStep("crop");
    e.target.value = "";
  }

  async function handleConfirmCrop() {
    if (!rawUrl || !croppedAreaPixels) return;
    const file = await getCroppedImageFile(
      rawUrl,
      croppedAreaPixels,
      originalName,
    );
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setCroppedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStep("preview");
  }

  function handleDiscardCrop() {
    if (rawUrl) URL.revokeObjectURL(rawUrl);
    setRawUrl(null);
    setCroppedFile(null);
    setStep("idle");
  }

  async function handleSave() {
    if (!croppedFile) return;
    await uploadPhoto(croppedFile);
    onClose();
  }

  async function handleRemove() {
    await updateProfile({ profileImageUrl: null });
    onClose();
  }

  const displayUrl = previewUrl ?? imageUrl;

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const footer =
    step === "crop" ? (
      <>
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleDiscardCrop}
        >
          Cancelar
        </Button>
        <Button className="w-full" onClick={handleConfirmCrop}>
          Cortar
        </Button>
      </>
    ) : step === "preview" ? (
      <>
        {!displayUrl && (
          <Button
            variant="primary"
            className="w-full"
            onClick={handleEditClick}
          >
            Adicionar foto
          </Button>
        )}
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleDiscardCrop}
        >
          Cancelar
        </Button>
        <Button className="w-full" onClick={handleSave} isLoading={isLoading}>
          Salvar
        </Button>
      </>
    ) : step === "firstUpload" ? (
      <>
        <CancelButton className="w-full" onClick={onClose} />
        <Button
          variant="primary"
          className="w-full"
          onClick={handleEditClick}
        >
          Adicionar foto
        </Button>
      </>
    ) : (
      <>
        <CancelButton className="w-full" onClick={onClose} />
        {imageUrl && (
          <Button
            variant="danger"
            className="w-full"
            onClick={handleRemove}
            isLoading={isLoading}
          >
            Remover foto
          </Button>
        )}
      </>
    );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      showCloseButton={false}
      variant="sheet"
      size="sm"
      bodyClassName="px-5 pb-2 md:px-6 md:pt-5"
      footerClassName="flex-col-reverse items-stretch gap-3 px-5 py-4 pb-10 md:flex-row md:items-center md:px-6 md:pb-6"
      footer={footer}
    >
      <h2 className="text-2xl font-semibold text-neutral-900">
        Foto de perfil
      </h2>

      {/* ── CROP STEP ─────────────────────────────────────────── */}
      {step === "crop" && rawUrl && (
        <>
          <div
            className="relative w-full overflow-hidden rounded-xl bg-black"
            style={{ height: 300 }}
          >
            <Cropper
              image={rawUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="flex items-center gap-3 mt-4 px-1">
            <span className="text-xs text-slate-500">−</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary-main"
            />
            <span className="text-xs text-slate-500">+</span>
          </div>
        </>
      )}

      {/* ── IDLE / PREVIEW STEP ───────────────────────────────── */}
      {step !== "crop" && (
        <div className="flex justify-center py-12">
          <div className="relative">
            <div className="h-32 w-32 rounded-full overflow-hidden bg-slate-100 ring-4 ring-white shadow-md">
              {displayUrl ? (
                <Image
                  src={displayUrl}
                  alt={name}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                  unoptimized={!!previewUrl}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary-main">
                  <span className="text-3xl font-bold text-white">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleEditClick}
              className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary-main text-white shadow-lg transition hover:bg-primary-darker"
              aria-label="Alterar foto"
            >
              <Pencil size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </Modal>
  );
}
