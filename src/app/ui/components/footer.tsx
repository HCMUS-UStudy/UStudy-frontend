import React from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaX } from "react-icons/fa6";

export default function Footer() {
  return (
    <div className="h-[400px] py-12 bg-sky-950 text-white tracking-wider flex justify-evenly">
      <div className=" max-w-[445px]">
        <div id="introduce" className="text-[62px] font-bold">
          UStudy
        </div>
        <div className="text-sm text-slate-300 leading-6">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry&apos;s standard dummy text
          ever since the 1500s, when an unknown printer took a galley of type
          and scrambled it to make a type specimen book.
        </div>
        <div className="flex w-full mt-5 gap-7 justify-items-start">
          <FaFacebook className="w-10 h-10" />
          <FaInstagram className="w-10 h-10" />
          <FaYoutube className="w-10 h-10" />
          <FaX className="w-10 h-10" />
        </div>
      </div>
      <div>
        <p className="font-bold text-2xl">Thông tin chung</p>
        <div className="leading-10 mt-4 font-thin">
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
        <div className="leading-10 mt-4 font-thin">
          <p>227 Đ. Nguyễn Văn Cừ, Phường 4, Quận 5, Hồ Chí Minh</p>
          <p>+1 202-918-2132</p>
          <p>tploc@fit.hcmus.edu.vn</p>
          <p>www.hcmus.edu.vn</p>
        </div>
      </div>
    </div>
  );
}
