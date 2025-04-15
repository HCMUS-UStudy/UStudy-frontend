import Link from "next/link";
import { Button } from "@/app/ui/components/_common/Button";
import Image from "next/image";
import Footer from "@/app/ui/components/_common/Footer";
import LandingPageSideBar from "@/app/ui/components/_common/sidebar/LandingPageSideBar";
import CreateTeacher from "./ui/components/user/CreateTeacher";
import { IoLogInOutline } from "react-icons/io5";
import Logo from "@/app/ui/components/_common/Logo";
import StudentRegisterBtn from "./ui/components/user/student/register/StudentRegisterBtn";

export default async function Home() {
  try {
    const courses = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses`,
      {
        cache: "no-store",
      },
    );
    console.log(await courses.json());
  } catch (error) {
    console.log(error);
  }
  const RenderMainFeatures: React.FC = (): React.ReactNode => {
    const contents = [
      {
        FeatureName: "Quản lý lớp học",
        Description:
          "Ứng dụng hỗ trợ giáo viên và giáo vụ quản lý lớp học một cách dễ dàng và hiệu quả. Bạn có thể tạo lớp học, phân công giảng viên, và theo dõi tiến độ học tập của học viên chỉ trong vài bước đơn giản.",
      },
      {
        FeatureName: "Quản lý học sinh",
        Description:
          "Giúp giáo viên và giáo vụ theo dõi sự tiến bộ của từng học viên trong lớp học. Dễ dàng chấm điểm, điểm danh, và ghi nhận kết quả học tập của học viên để đánh giá sự tiến bộ trong suốt khóa học.",
      },
      {
        FeatureName: "Tính năng bài tập đa dạng",
        Description:
          "Ứng dụng hỗ trợ giáo viên tạo và giao bài tập cho học sinh, từ bài tập trắc nghiệm đến bài viết tự luận. Học sinh có thể làm bài tập trực tuyến và nhận kết quả ngay lập tức.",
      },
      {
        FeatureName: "Chấm điểm tự động và thống kê chi tiết",
        Description:
          "Hệ thống chấm điểm tự động giúp tiết kiệm thời gian cho giáo viên. Đồng thời, ứng dụng cung cấp các báo cáo thống kê chi tiết về điểm số và kết quả học tập của học sinh theo từng lớp và môn học.",
      },
      {
        FeatureName: "Điểm danh và quản lý thời gian học",
        Description:
          "Giáo viên có thể điểm danh học sinh một cách nhanh chóng và chính xác, đồng thời theo dõi thời gian học của học sinh. Các báo cáo điểm danh được lưu trữ và có thể tra cứu dễ dàng.",
      },
      {
        FeatureName: "Hỗ trợ phụ huynh theo dõi học tập",
        Description:
          "Phụ huynh có thể theo dõi kết quả học tập và sự tiến bộ của con em mình thông qua báo cáo định kỳ. Ứng dụng giúp phụ huynh luôn nắm bắt được tình hình học tập của học sinh mọi lúc, mọi nơi.",
      },
    ];
    return (
      <>
        {contents.map((c, i) => {
          return (
            <div
              key={i}
              className="lg:h-72 text-center py-6 px-5 md:px-10 flex flex-col justify-center items-center gap-1 md:gap-3 bg-white border border-slate-300 rounded-xl"
            >
              {/* <FaBook className="w-8 h-8 md:w-16 md:h-16 md:flex hidden" /> */}
              <div className="text-xl xl:text-2xl font-bold">
                {c.FeatureName}
              </div>
              <div className="text-secondary-text text-xs md:text-base">
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
      <div className=" bg-hero h-fit pb-10 md:pb-0 md:h-[570px] lg:h-[540px] rounded-b-[50px] lg:rounded-b-[140px] pt-10 px-12 lg:px-20">
        <div className="flex justify-between items-center">
          <Logo />
          <LandingPageSideBar />
          <Button
            className="px-10 py-3 rounded-[20px] text-[17px] min-[320px]:hidden md:flex hover:scale-105 transition-all duration-300"
            type="submit"
          >
            <Link
              href="/login"
              className="translate-x-0 group-hover:-translate-x-3.5 transition-transform duration-300"
            >
              Đăng nhập
            </Link>
            <IoLogInOutline className="absolute size-8 opacity-0 group-hover:translate-x-12 group-hover:opacity-100 transition-all duration-300" />
          </Button>
        </div>
        <div className="flex flex-col md:grid grid-cols-5 justify-between gap-5 px-3 md:px-5 lg:px-2 pt-10">
          <div className="flex flex-col gap-6 md:col-span-3 text-[35px] lg:text-[40px] xl:text-[50px] md:mr-10 font-bold">
            <div className="leading-tight md:leading-normal">
              <div className=" tracking-tight md:tracking-normal">
                <span className="text-highlight-text">Kết nối</span> tri thức
              </div>
              <div className=" tracking-tight md:tracking-normal">
                <span className="text-highlight-text">Chinh phục</span> mọi mục
                tiêu
              </div>
              <div className="text-secondary-text font-light text-sm md:text-sm lg:text-base mt-2">
                UStudy giúp giáo viên, học viên và phụ huynh kết nối dễ dàng
                trong môi trường học tập hiện đại. Với các công cụ hỗ trợ tạo
                lớp học, giao bài tập, chấm điểm, theo dõi tiến độ và điểm danh,
                UStudy mang đến trải nghiệm học tập hiệu quả và tiện lợi. Hãy
                bắt đầu hành trình chinh phục tri thức của bạn ngay hôm nay!
              </div>
            </div>
            <StudentRegisterBtn />
          </div>
          {/* <Image
              className="object-cover border-4 border-primary-darker rounded-[24px] aspect-auto md:flex hidden"
              src="/tutorSystem3.webp"
              width={500}
              height={450}
              alt="tutorSystem"
              loading="lazy"
            /> */}
          <div className="relative col-span-2 w-full md:h-[350px] lg:h-[300px]">
            <Image
              className="object-cover border-4 aspect-auto md:flex hidden border-primary-darker rounded-[24px]"
              src="/tutorSystem3.webp"
              alt="tutorSystem"
              loading="lazy"
              fill
            />
          </div>
        </div>
      </div>
      <div className="md:px-10 xl:px-24 mx-auto flex flex-col justify-center">
        <div className="mt-12 mx-9 md:mx-36 xl:mx-44 text-center">
          <div className="font-bold text-[30px] tracking-tighter md:tracking-normal md:text-[40px]">
            <span className="text-highlight-text">Vì sao</span> nên chọn UStudy?
          </div>
          <div className="text-gray-700 text-sm md:text-base xl:text-lg font-thin mt-3">
            UStudy mang đến giải pháp quản lý học tập toàn diện, giúp giáo viên,
            học sinh, và phụ huynh kết nối dễ dàng và hiệu quả. Chúng tôi cung
            cấp các công cụ giúp bạn theo dõi tiến độ học tập, đánh giá và cải
            thiện chất lượng giảng dạy nhanh chóng và chính xác.
          </div>
        </div>
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
