"use client";

import Image from "next/image";
import { useState } from "react";
// use cn utility so we can have conditional classes
import { cn } from "@/lib/utils";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        alt="product image"
        width={400}
        height={400}
        className="min-h-[300px] object-cover object-center"
      />

      <div className="flex">
        {images.map((img, idx) => (
          <div
            key={img}
            onClick={() => setCurrent(idx)}
            className={cn(
              "border mr-2 cursor-pointer hover:border-orange-600",
              current === idx && "border-orange-500"
            )}
          >
            <Image src={img} alt="image" width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
