import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <div className="h-fit md:px-0 px-7 py-12 bg-footer text-white tracking-wider flex flex-col md:gap-0 gap-10 md:flex-row justify-evenly">
      <div className=" max-w-[445px]">
        <div id="introduce" className="text-[50px] md:text-[62px] font-bold">
          UStudy
        </div>
        <div className="text-sm text-slate-300 leading-6">
          UStudy giúp giáo viên, học viên và phụ huynh kết nối dễ dàng trong môi
          trường học tập hiện đại. Với các công cụ hỗ trợ tạo lớp học, giao bài
          tập, chấm điểm, theo dõi tiến độ và điểm danh, UStudy mang đến trải
          nghiệm học tập hiệu quả và tiện lợi. Hãy bắt đầu hành trình chinh phục
          tri thức của bạn ngay hôm nay!
        </div>
        <div className="flex w-full mt-5 gap-7 justify-items-start">
          <FaFacebook className="w-10 h-10" />
          <FaInstagram className="w-10 h-10" />
          <FaYoutube className="w-10 h-10" />
          <FaXTwitter className="w-10 h-10" />
        </div>
      </div>
      <div>
        <p className="font-bold text-2xl">Thông tin chung</p>
        <div className="md:leading-10 leading-8 mt-4 font-thin">
          <p>21127116 - Nguyễn Lê Thanh Nghĩa</p>
          <p>21127143 - Nguyễn Minh Quân</p>
          <p>21127147 - Võ Anh Quân</p>
          <p>21127419 - Ngô Phước Tài</p>
          <p>21127478 - Trần Thị Thanh Vân</p>
          <p>21127616 - Lê Phước Quang Huy</p>
        </div>
      </div>
      <div>
        <p className="font-bold text-2xl">Liên hệ</p>
        <div className="md:leading-10 leading-8 mt-4 font-thin">
          <p>227 Đ. Nguyễn Văn Cừ, Phường 4, Quận 5, Hồ Chí Minh</p>
          <p>+1 202-918-2132</p>
          <p>tploc@fit.hcmus.edu.vn</p>
          <p>www.hcmus.edu.vn</p>
        </div>
      </div>
    </div>
  );
}
