import Link from "next/link";
// import { Button } from "@/app/ui/components/_common/Button";
import Image from "next/image";
import Footer from "@/app/ui/components/_common/landingPage/Footer";
// import LandingPageSideBar from "@/app/ui/components/_common/sidebar/LandingPageSideBar";
import CreateTeacher from "./ui/components/user/CreateTeacher";
// import { IoLogInOutline } from "react-icons/io5";
import Logo from "@/app/ui/components/_common/Logo";

import Hero from "./ui/components/_common/landingPage/Hero";
import WhyUs from "./ui/components/_common/landingPage/WhyUs";

export default async function Home() {
  const RenderMainFeatures: React.FC = (): React.ReactNode => {
    const contents = [
      {
        FeatureName: "Quản lý lớp học",
        Description:
          "Ứng dụng hỗ trợ giáo viên và giáo vụ quản lý lớp học một cách dễ dàng và hiệu quả. Bạn có thể tạo lớp học, phân công giảng viên, và theo dõi tiến độ học tập của học viên chỉ trong vài bước đơn giản.",
        icon: "🎓",
        color: "from-blue-500 to-blue-600",
      },
      {
        FeatureName: "Quản lý học sinh",
        Description:
          "Giúp giáo viên và giáo vụ theo dõi sự tiến bộ của từng học viên trong lớp học. Dễ dàng chấm điểm, điểm danh, và ghi nhận kết quả học tập của học viên để đánh giá sự tiến bộ trong suốt khóa học.",
        icon: "👥",
        color: "from-purple-500 to-purple-600",
      },
      {
        FeatureName: "Tính năng bài tập đa dạng",
        Description:
          "Ứng dụng hỗ trợ giáo viên tạo và giao bài tập cho học sinh, từ bài tập trắc nghiệm đến bài viết tự luận. Học sinh có thể làm bài tập trực tuyến và nhận kết quả ngay lập tức.",
        icon: "📚",
        color: "from-green-500 to-green-600",
      },
      {
        FeatureName: "Chấm điểm tự động và thống kê chi tiết",
        Description:
          "Hệ thống chấm điểm tự động giúp tiết kiệm thời gian cho giáo viên. Đồng thời, ứng dụng cung cấp các báo cáo thống kê chi tiết về điểm số và kết quả học tập của học sinh theo từng lớp và môn học.",
        icon: "📊",
        color: "from-red-500 to-red-600",
      },
      {
        FeatureName: "Điểm danh và quản lý thời gian học",
        Description:
          "Giáo viên có thể điểm danh học sinh một cách nhanh chóng và chính xác, đồng thời theo dõi thời gian học của học sinh. Các báo cáo điểm danh được lưu trữ và có thể tra cứu dễ dàng.",
        icon: "⏰",
        color: "from-yellow-500 to-yellow-600",
      },
      {
        FeatureName: "Hỗ trợ phụ huynh theo dõi học tập",
        Description:
          "Phụ huynh có thể theo dõi kết quả học tập và sự tiến bộ của con em mình thông qua báo cáo định kỳ. Ứng dụng giúp phụ huynh luôn nắm bắt được tình hình học tập của học sinh mọi lúc, mọi nơi.",
        icon: "👨‍👩‍👧‍👦",
        color: "from-pink-500 to-pink-600",
      },
    ];

    return (
      <>
        {contents.map((c, i) => {
          return (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
              ></div>
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-center">
                  <span className="text-4xl">{c.icon}</span>
                </div>
                <h3 className="mb-4 text-center text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-primary-darkest">
                  {c.FeatureName}
                </h3>
                <p className="text-center text-sm text-gray-600 md:text-base">
                  {c.Description}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary-darkest to-primary-darker transition-all duration-300 group-hover:w-full"></div>
            </div>
          );
        })}
      </>
    );
  };
  return (
    <div className=" bg-background">
      <div className=" bg-hero h-fit pb-10 md:pb-0 md:h-[570px] lg:h-[540px] pt-10 px-12 lg:px-20 relative">
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-[calc(100%+1.3px)] h-[120px]"
          >
            <path
              d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z"
              className="fill-background"
            />
          </svg>
        </div>
        <div className="flex justify-between items-center">
          <Logo />
          {/* <LandingPageSideBar /> */}
          {/* <button className="cursor-pointer transition-all bg-primary text-black text-base text-nowrap md:text-[17px] px-5 py-2 sm:px-10 sm:py-3 rounded-lg border-primary-darker border-b-[4px] font-bold hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
            <Link
              href="/login"
              className="translate-x-0 group-hover:-translate-x-3.5 transition-transform duration-300"
            >
              Đăng nhập
            </Link>
          </button> */}
          <div className="text-base md:text-xl text-nowrap bg-transparent rounded-xl items-center justify-center flex border-2 border-primary-darkest  hover:bg-primary-darker text-primary-darkest font-bold hover:text-white transition-all cursor-pointer active:scale-[0.98]">
            <button className="px-5 py-2 md:px-10 md:py-3">
              <Link href="/login">Đăng nhập</Link>
            </button>
          </div>

          {/* <Button
            className="px-10 py-3 rounded-lg text-[17px] min-[320px]:hidden md:flex hover:scale-105 transition-all duration-300"
            type="submit"
          >
            <Link
              href="/login"
              className="translate-x-0 group-hover:-translate-x-3.5 transition-transform duration-300"
            >
              Đăng nhập
            </Link>
            <IoLogInOutline className="absolute size-8 opacity-0 group-hover:translate-x-12 group-hover:opacity-100 transition-all duration-300" />
          </Button> */}
        </div>
        <Hero />
      </div>
      <div className="md:px-10 xl:px-24 mx-auto flex flex-col justify-center">
        <WhyUs />
        <div className="mx-12 mt-10 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-10">
          <RenderMainFeatures />
        </div>
        <div className="relative max-w-[1120px] h-max-[220px]  px-5 md:px-36 py-10 mt-10 md:mt-32 rounded-3xl text-white text-center mx-8 md:mx-auto text-sm md:text-2xl  bg-gradient-to-r from-primary-darkest via-primary-darker to-primary-darkest">
          “Học tập không chỉ là thu nhận kiến thức, mà còn là rèn luyện tư duy,
          phát triển nhân cách và mở rộng tầm nhìn. Kiến thức có thể giúp ta
          thành công, nhưng chính sự hiểu biết và trí tuệ mới giúp ta thay đổi
          thế giới.”
          <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-3 flex flex-col items-center">
            <Image
              className="rounded-3xl object-none object-top w-[108px] h-[108px] border border-black"
              src="/einstein.jpg"
              width={108}
              height={108}
              alt="JohnAbbott"
              loading="lazy"
            />
            <div className="text-black text-center mt-3">
              <div className="font-bold text-2xl">Albert Einstein</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-hero rounded-t-[70px] lg:rounded-t-[100px] mt-[200px] py-8 flex items-center justify-evenly">
        <div className="relative xl:h-[500px] xl:w-[500px] lg:h-[350px] lg:w-[350px] hidden lg:flex">
          <Image
            className="object-contain"
            src="/TeacherRegister.png"
            // width={500}
            // height={500}
            alt="TeacherRegister"
            priority
            fill
          />
        </div>
        <div>
          <CreateTeacher />
        </div>
      </div>
      <Footer />
    </div>
  );
}
