import Image from "next/image";

export default function FallingImages() {
  return (
    <>
      <Image
        className="absolute animate-fall_1 -top-[100px] opacity-50 left-[0%]"
        src="/Intersect.png"
        alt="Intersect"
        width={100}
        height={100}
      />
      <Image
        className="absolute animate-fall_2 -top-[100px] opacity-50 left-[22%]"
        src="/Intersect.png"
        alt="Intersect"
        width={100}
        height={100}
      />
      <Image
        className="absolute animate-fall_3 -top-[100px] opacity-50 left-[44%]"
        src="/Intersect.png"
        alt="Intersect"
        width={100}
        height={100}
      />
      <Image
        className="absolute animate-fall_4 -top-[100px] opacity-50 left-[66%]"
        src="/Intersect.png"
        alt="Intersect"
        width={100}
        height={100}
      />
      <Image
        className="absolute animate-fall_5 -top-[100px] opacity-50 left-[90%]"
        src="/Intersect.png"
        alt="Intersect"
        width={100}
        height={100}
      />
    </>
  );
}
