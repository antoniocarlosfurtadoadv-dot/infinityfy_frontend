export interface IPixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function getCroppedImageFile(
  imageSrc: string,
  pixelCrop: IPixelCrop,
  fileName: string,
  mimeType = "image/jpeg",
  quality = 0.92,
): Promise<File> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Canvas toBlob failed"));
        resolve(new File([blob], fileName, { type: mimeType }));
      },
      mimeType,
      quality,
    );
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
