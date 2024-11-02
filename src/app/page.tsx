"use client";
import Link from "next/link";
import Button from "./ui/components/button";
import Image from "next/image";
import { FaBook } from "react-icons/fa6";

export default function Home() {
  const RenderMainFeatures: React.FC = (): React.ReactNode => {
    const contents = [
      {
        FeatureName: "Easy Class Management",
        Description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been.....",
      },
      {
        FeatureName: "Easy Class Management",
        Description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been.....",
      },
      {
        FeatureName: "Easy Class Management",
        Description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been.....",
      },
      {
        FeatureName: "Easy Class Management",
        Description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been.....",
      },
      {
        FeatureName: "Easy Class Management",
        Description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been.....",
      },
      {
        FeatureName: "Easy Class Management",
        Description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been.....",
      },
    ];
    return (
      <>
        {contents.map((c, i) => {
          return (
            <div
              key={i}
              className="h-60 text-center py-4 px-10 flex flex-col gap-3 items-center bg-white border border-black rounded-xl">
              <FaBook className="w-16 h-16" />
              <p className="text-2xl font-bold">{c.FeatureName}</p>
              <p className="text-secondary_text">{c.Description}</p>
            </div>
          );
        })}
      </>
    );
  };
  return (
    <div className=" bg-background">
      <div className=" bg-hero h-[550px] rounded-bl-[200px] pt-10 px-20">
        <div id="Top-nav-bar" className="flex justify-between">
          <div id="logo" className="text-3xl font-extrabold">
            <span className=" text-highlight_text">US</span>tudy
          </div>
          <div
            id="nav-bar"
            className="flex justify-between items-center font-bold text-xl gap-8">
            <Link
              href="#"
              className=" text-slate-500 hover:text-black transition duration-200 ease-in-out">
              Home
            </Link>
            <Link
              href="#"
              className=" text-slate-500 hover:text-black transition duration-200 ease-in-out">
              Teachers
            </Link>
            <Link
              href="#"
              className=" text-slate-500 hover:text-black transition duration-200 ease-in-out">
              Academic Staff
            </Link>
            <Link
              href="#"
              className=" text-slate-500 hover:text-black transition duration-200 ease-in-out">
              Classroom
            </Link>
          </div>
          <Button className=" w-[150px] text-lg" type="submit">
            Đăng nhập
          </Button>
        </div>
        <div
          id="hero-content"
          className="flex justify-between gap-5 px-10 pt-8">
          <div className="flex flex-col justify-between text-[50px] font-bold max-w-[800px]">
            <div>
              <p>
                <span className="text-highlight_text">Kết nối</span> tri thức
              </p>
              <p>
                <span className="text-highlight_text">Chinh phục</span> mọi mục
                tiêu
              </p>
              <p className="text-secondary_text font-light text-base mt-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam,
                vero maiores minima magni vel reprehenderit impedit culpa, in
                asperiores voluptatum ut, non quis provident earum deserunt
                quaerat nemo laborum. Reprehenderit.
              </p>
            </div>
            <Button className="w-[200px] font-bold text-lg" type="submit">
              Bắt đầu
            </Button>
          </div>
          <div>
            <Image
              className="object-cover border rounded-[24px]"
              src="/tutorSystem.jpg"
              width={500}
              height={500}
              alt="tutorSystem"
            />
          </div>
        </div>
      </div>
      <div
        id="main-content"
        className="px-24 mx-auto flex flex-col justify-center">
        <div className="mt-12 mx-44 text-center">
          <div className="font-bold text-[52px]">
            <span className="text-highlight_text">Why we are</span> best from
            others?
          </div>
          <div className="text-secondary_text text-lg font-thin mt-5">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since the 1500s.....
          </div>
        </div>
        <div className="mx-12 mt-10 grid grid-cols-3 gap-10">
          <RenderMainFeatures />
        </div>
        <div className="relative max-w-[1120px] h-max-[220px] px-36 py-10 mt-32 rounded-3xl text-background text-center mx-auto text-2xl  bg-gradient-to-r from-sky-500 to-sky-900">
          “Làm thế nào anh biết nhiều về mọi thứ? đã hỏi một người rất khôn
          ngoan và thông minh; và câu trả lời là. Bằng cách không bao giờ sợ hãi
          hoặc xấu hổ khi đặt câu hỏi về bất cứ điều gì mà tôi không biết”
          <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-3 flex flex-col items-center">
            <Image
              className="rounded-3xl object-none object-top w-[108px] h-[108px]"
              src="/JohnAbbott.webp"
              width={108}
              height={108}
              alt="JohnAbbott"
            />
            <div className="text-black text-center mt-3">
              <p className="font-bold text-2xl">John Abbott</p>
              <p className="text-base mt-1">CANADA</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-hero">giáo viên</div>
    </div>
  );
}
