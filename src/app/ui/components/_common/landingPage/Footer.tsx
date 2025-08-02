import React from "react";

export default function Footer() {
  return (
    <footer className="bg-footer text-white px-6 md:px-12 lg:px-20 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Giới thiệu */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
            UStudy
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            UStudy là nền tảng học tập hiện đại giúp giáo viên, học viên và phụ
            huynh kết nối hiệu quả. Với các công cụ như tạo lớp học, giao bài,
            chấm điểm và theo dõi tiến độ, UStudy đồng hành cùng bạn trong hành
            trình chinh phục tri thức.
          </p>
        </div>

        {/* Tính năng nổi bật */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Tính năng nổi bật</h2>
          <ul className="space-y-3 text-slate-300 text-sm md:text-base">
            <li className="hover:text-white transition">
              Tạo và quản lý lớp học
            </li>
            <li className="hover:text-white transition">
              Giao bài tập và chấm điểm
            </li>
            <li className="hover:text-white transition">
              Theo dõi tiến độ học tập
            </li>
            <li className="hover:text-white transition">
              Kết nối giáo viên - học viên - phụ huynh
            </li>
          </ul>
        </div>

        {/* Liên hệ */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Liên hệ</h2>
          <ul className="space-y-3 text-slate-300 text-sm md:text-base">
            <li>227 Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM</li>
            <li>+84 202-918-2132</li>
            <li>tploc@fit.hcmus.edu.vn</li>
            <li>
              <a
                href="https://ustudy.io.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white transition"
              >
                https://ustudy.io.vn
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="mt-12 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} UStudy. Mọi quyền được bảo mật.
      </div>
    </footer>
  );
}
