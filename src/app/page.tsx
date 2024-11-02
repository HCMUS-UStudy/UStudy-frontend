"use client";
import Link from "next/link";
import Button from "./ui/components/button";
import Image from "next/image";
import { FaBars, FaBook, FaX } from "react-icons/fa6";
import { Input } from "./ui/components/input";
import Footer from "./ui/components/footer";
import { useState } from "react";
import clsx from "clsx";

export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleSideBar = () => {
    console.log(isOpen);
    setIsOpen(!isOpen);
  };
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
              className=" h-fit md:h-60 text-center py-4 px-5 md:px-10 flex flex-col gap-1 md:gap-3 items-center bg-white border border-slate-300 rounded-xl">
              <FaBook className="w-8 h-8 md:w-16 md:h-16 md:flex hidden" />
              <p className="text-lg md:text-2xl font-bold">{c.FeatureName}</p>
              <p className="text-secondary_text text-xs md:text-base">
                {c.Description}
              </p>
            </div>
          );
        })}
      </>
    );
  };
  const SideBar = () => {
    return (
      <div
        className={clsx(
          "fixed top-0 right-0 w-[80vw] bg-background h-screen overflow-y-auto tranform transition-transform duration-300",
          { "translate-x-0": isOpen, "translate-x-full": !isOpen }
        )}>
        <button onClick={toggleSideBar} type="button">
          <FaX />
        </button>
        sidebar
      </div>
    );
  };
  return (
    <div className=" bg-background">
      <SideBar />
      <div className=" bg-hero h-fit pb-10 md:pb-0 md:h-[550px] rounded-b-[50px] md:rounded-bl-[200px] md:rounded-br-none pt-10 min-[320px]:px-8 md:px-20">
        <div id="Top-nav-bar" className="flex justify-between items-center">
          <div id="logo" className="text-3xl font-extrabold">
            <span className=" text-highlight_text">US</span>tudy
          </div>
          <Button
            onClick={toggleSideBar}
            className="w-12 h-12 min-[320px]:flex md:hidden">
            <FaBars />
          </Button>
          <div
            id="nav-bar"
            className="justify-between items-center font-bold text-xl gap-8 min-[320px]:hidden md:flex">
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
          <Button
            className="w-[150px] text-lg min-[320px]:hidden md:flex"
            type="submit">
            <Link href="/login">Đăng nhập</Link>
          </Button>
        </div>
        <div
          id="hero-content"
          className="flex flex-col md:flex-row justify-between gap-5 px-3 md:px-10 pt-8">
          <div className="flex flex-col gap-6 md:justify-between text-[35px] md:text-[50px] font-bold max-w-[800px]">
            <Image
              className="object-cover border rounded-[24px] aspect-auto md:hidden flex"
              src="/tutorSystem.jpg"
              width={500}
              height={500}
              alt="tutorSystem"
            />
            <div className="leading-tight md:leading-normal">
              <p className=" tracking-tight md:tracking-normal">
                <span className="text-highlight_text">Kết nối</span> tri thức
              </p>
              <p className=" tracking-tight md:tracking-normal">
                <span className="text-highlight_text">Chinh phục</span> mọi mục
                tiêu
              </p>
              <p className="text-secondary_text font-light text-sm md:text-base mt-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam,
                vero maiores minima magni vel reprehenderit impedit culpa, in
                asperiores voluptatum ut, non quis provident earum deserunt
                quaerat nemo laborum. Reprehenderit.
              </p>
            </div>
            <Button
              className="w-full md:w-[200px] font-bold text-lg"
              type="submit">
              Bắt đầu
            </Button>
          </div>
          <Image
            className="object-cover border rounded-[24px] aspect-auto md:flex hidden"
            src="/tutorSystem.jpg"
            width={500}
            height={500}
            alt="tutorSystem"
          />
        </div>
      </div>
      <div
        id="main-content"
        className="md:px-24 mx-auto flex flex-col justify-center">
        <div className="mt-12 mx-9 md:mx-44 text-center">
          <div className="font-bold text-[30px] tracking-tighter md:tracking-normal md:text-[52px]">
            <span className="text-highlight_text">Why we are</span> best from
            others?
          </div>
          <div className="text-secondary_text text-sm md:text-lg font-thin mt-3">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since the 1500s.....
          </div>
        </div>
        <div className="mx-12 mt-10 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-10">
          <RenderMainFeatures />
        </div>
        <div className="relative max-w-[1120px] h-max-[220px]  px-5 md:px-36 py-10 mt-10 md:mt-32 rounded-3xl text-background text-center mx-8 md:mx-auto text-sm md:text-2xl  bg-gradient-to-r from-sky-500 to-sky-900">
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
      <div className="bg-hero mt-[200px] py-8 flex justify-evenly">
        <Image
          className="md:flex hidden"
          src="/TeacherRegister.png"
          width={500}
          height={500}
          alt="TeacherRegister"
        />
        <div>
          <div className="font-bold text-[30px] md:text-[50px] tracking-tighter md:tracking-normal text-center">
            Trở thành<span className="text-highlight_text"> Giáo Viên</span>
          </div>
          <div className="w-[80vw] md:w-[500px] mt-4 flex flex-col gap-3 md:gap-5">
            <Input
              className="w-full h-11 text-base text-secondary_text"
              placeholder="Họ tên"
            />
            <Input
              className="w-full h-11 text-base text-secondary_text"
              placeholder="Email"
            />
            <Input
              className="w-full h-11 text-base text-secondary_text"
              placeholder="Giới tính"
            />
            <Input
              className="w-full h-11 text-base text-secondary_text"
              placeholder="Ngày sinh"
            />
            <Input
              className="w-full h-11 text-base text-secondary_text"
              placeholder="Số điện thoại"
            />
            <Input
              className="w-full h-11 text-base text-secondary_text"
              placeholder="Địa chỉ"
            />
            <Button className=" mt-5">Đăng ký</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
