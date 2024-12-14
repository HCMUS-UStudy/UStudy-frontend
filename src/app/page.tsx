import Link from "next/link";
import { Button } from "./ui/components/button";
import Image from "next/image";
import { FaBook, FaUserGraduate } from "react-icons/fa6";
import Footer from "./ui/components/footer";
import LandingPageSideBar from "./ui/sidebar/landingPageSideBar";
import CreateTeacher from "./ui/components/createTeacher";
import { IoLogInOutline, IoSparkles } from "react-icons/io5";

export default async function Home() {
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
              <div className="text-lg md:text-2xl font-bold">
                {c.FeatureName}
              </div>
              <div className="text-secondary_text text-xs md:text-base">
                {c.Description}
              </div>
            </div>
          );
        })}
      </>
    );
  };
  return (
    <div className=" bg-background">
      <div className=" bg-hero h-fit pb-10 md:pb-0 md:h-[550px] rounded-b-[50px] md:rounded-bl-[200px] md:rounded-br-none pt-10 min-[320px]:px-8 md:px-20">
        <div id="Top-nav-bar" className="flex justify-between items-center">
          <div id="logo" className="text-4xl font-extrabold">
            <span className=" text-highlight_text">US</span>tudy
          </div>
          <LandingPageSideBar />
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
            className=" px-8 font-bold relative text-lg min-[320px]:hidden md:flex bg-gradient-to-tr from-blue-600 to-blue-800 border-2 border-blue-600 300 rounded-xl group transition-all duration-300 hover:scale-110"
            type="submit">
            <Link
              href="/login"
              className="translate-x-0 group-hover:-translate-x-3.5 transition-transform duration-300">
              Đăng nhập
            </Link>
            <IoLogInOutline className="absolute size-8 opacity-0 group-hover:translate-x-12 group-hover:opacity-100 transition-all duration-300" />
          </Button>
        </div>
        <div
          id="hero-content"
          className="flex flex-col md:flex-row justify-between gap-5 px-3 md:px-10 pt-8">
          <div className="flex flex-col gap-6 md:justify-between text-[35px] md:text-[50px] font-bold max-w-[800px]">
            <div className="leading-tight md:leading-normal">
              <div className=" tracking-tight md:tracking-normal">
                <span className="text-highlight_text">Kết nối</span> tri thức
              </div>
              <div className=" tracking-tight md:tracking-normal">
                <span className="text-highlight_text">Chinh phục</span> mọi mục
                tiêu
              </div>
              <div className="text-secondary_text font-light text-sm md:text-base mt-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam,
                vero maiores minima magni vel reprehenderit impedit culpa, in
                asperiores voluptatum ut, non quis provident earum deserunt
                quaerat nemo laborum. Reprehenderit.
              </div>
            </div>
            <Button
              className="w-full relative overflow-hidden group md:w-[300px] rounded-xl font-bold text-xl tracking-wider py-4 bg-gradient-to-tr from-blue-600 via-blue-800 to-blue-600 bg-[length:200%_200%] bg-[0%_100%] hover:bg-[100%_0%] hover:scale-110 transition-all duration-300"
              type="submit">
              Bắt đầu
              <span className="absolute -translate-y-1 translate-x-1 opacity-20">
                Bắt đầu
              </span>
              <IoSparkles className="absolute size-10 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <IoSparkles className="absolute size-12 left-5 bottom-1 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <FaUserGraduate className="absolute size-14 -right-7 -bottom-2 origin-bottom group-hover:-rotate-[30deg] opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </Button>
          </div>
          <Image
            className="object-cover border-4 border-sky-600 rounded-[24px] aspect-auto md:flex hidden"
            src="/tutorSystem3.webp"
            width={500}
            height={450}
            alt="tutorSystem"
            loading="lazy"
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
        <div className="relative max-w-[1120px] h-max-[220px]  px-5 md:px-36 py-10 mt-10 md:mt-32 rounded-3xl text-blue-50 text-center mx-8 md:mx-auto text-sm md:text-2xl  bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900">
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
              loading="lazy"
            />
            <div className="text-black text-center mt-3">
              <div className="font-bold text-2xl">John Abbott</div>
              <div className="text-base mt-1">CANADA</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-hero rounded-tl-[150px] mt-[200px] py-8 flex justify-evenly">
        <Image
          className="md:flex hidden"
          src="/TeacherRegister.png"
          width={500}
          height={500}
          alt="TeacherRegister"
          priority
        />
        <div>
          <CreateTeacher />
        </div>
      </div>
      <Footer />
    </div>
  );
}
