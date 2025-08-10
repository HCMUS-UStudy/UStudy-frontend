"use client";
import React from "react";
import { Carousel as AntdCarousel, ConfigProvider, Rate } from "antd";

const Carousel = () => {
  const Element = () => {
    return (
      <div className="px-3">
        <div className="p-4 border rounded-lg shadow-sm bg-white h-full flex flex-col">
          <h3 className="text-lg font-bold text-primary-darkest mb-2">
            course title
          </h3>
          <p className="text-sm text-gray-500 mb-1">Giảng viên: aehkfjaefjk</p>
          <Rate disabled allowHalf style={{ fontSize: 16 }} />
          <p className="text-xs text-gray-400 mb-3">2 học viên</p>
          <p className="text-sm text-gray-600 flex-grow">2</p>
        </div>
      </div>
    );
  };
  return (
    <ConfigProvider
      theme={{
        token: {},
      }}
    >
      <AntdCarousel style={{}} arrows={true} infinite={true} slidesToShow={4}>
        <Element />
        <Element />
        <Element />
        <Element />
      </AntdCarousel>
    </ConfigProvider>
  );
};

export default Carousel;
