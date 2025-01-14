import React from "react";
import { Slider, SliderPage, useSlider } from "../../slider";

export default function CreateClassContent() {
  return (
    <Slider>
      <SliderPage>
        <CreateClassNameAndGrade />
      </SliderPage>
      <SliderPage>
        <SubjectSelector />
      </SliderPage>
      <SliderPage>
        <DurationSelector />
      </SliderPage>
      {/* <SliderPage>
        
      </SliderPage> */}
    </Slider>
  );
}

const CreateClassNameAndGrade = () => {
  const context = useSlider();
  return (
    <div className="flex flex-col mb-3">
      <h1 className="text-center font-medium text-lg">Chọn khối cho lớp học</h1>
      <div className="flex flex-wrap max-w-[60%] mx-auto w-full gap-3 mt-4">
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
          Khối 1
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
          Khối 2
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
          Khối 3
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
          Khối 4
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
          Khối 5
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
          Khối 6
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
          Khối 7
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
          Khối 8
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
          Khối 9
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
          Khối 10
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
          Khối 11
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
          Khối 12
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
          IELTS
        </div>
      </div>
    </div>
  );
};

const SubjectSelector = () => {
  const context = useSlider();
  return (
    <div className="flex flex-col">
      <h1 className="text-center font-medium text-lg">Chọn môn học</h1>
      <div className="grid grid-cols-3 divide-x-2 divide-slate-200 mt-4">
        <div className="col-span-2 flex flex-wrap gap-4 px-10">
          <div
            onClick={context.nextStep}
            className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
            Toán
          </div>
          <div
            onClick={context.nextStep}
            className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
            Lý
          </div>
          <div
            onClick={context.nextStep}
            className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
            Hóa
          </div>
          <div
            onClick={context.nextStep}
            className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
            Sinh
          </div>
          <div
            onClick={context.nextStep}
            className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
            Anh
          </div>
          <div
            onClick={context.nextStep}
            className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
            Văn
          </div>
          <div
            onClick={context.nextStep}
            className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
            Sử
          </div>
          <div
            onClick={context.nextStep}
            className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
            Địa
          </div>
          <div
            onClick={context.nextStep}
            className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all">
            GDCD
          </div>
        </div>
        <div className="flex flex-col gap-2 px-3">
          <button
            type="button"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-800 transition-colors text-white text-sm rounded">
            Tiếp theo
          </button>
          <button
            onClick={context.prevStep}
            type="button"
            className="px-6 py-3 bg-slate-400 hover:bg-slate-500 transition-colors text-white text-sm rounded">
            Trở lại
          </button>
        </div>
      </div>
    </div>
  );
};

const DurationSelector = () => {
  const context = useSlider();
  return (
    <div className="flex flex-col">
      <h1 className="text-center font-medium text-lg">
        Chọn thời gian học cho lớp
      </h1>
      <div className="grid grid-cols-3 divide-x-2 divide-slate-200 mt-4">
        <div className="col-span-2 px-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-5 max-h-8 w-full">
              <label
                htmlFor="class-duration"
                className="after:content-['*'] after:text-red-500">
                Thời gian học:{" "}
              </label>
              <input
                id="class-duration"
                type="text"
                className="px-2 py-1 outline-none border-2 border-slate-200 rounded flex-1"
                placeholder="VD: 1, 2, 3"
              />
            </div>
            <div className="flex items-center gap-4">
              <h1 className="after:content-['*'] after:text-red-500">
                Đơn vị thời gian:{"  "}
              </h1>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="week"
                  className="cursor-pointer h-8 w-8 bg-slate-100 border-2 border-slate-200 rounded-full flex justify-center items-center relative">
                  <input
                    type="radio"
                    id="week"
                    name="duration-unit"
                    className="hidden peer"
                    value={"week"}
                  />
                  <div className="w-full h-full absolute bg-transparent border-blue-300 border-0 peer-checked:border-2 transition-colors rounded-full"></div>
                  <div className="w-4 h-4 bg-blue-600 scale-0  peer-checked:scale-100 transition-transform rounded-full"></div>
                </label>
                <span>Tuần</span>
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="month"
                  className="cursor-pointer h-8 w-8 bg-slate-100 border-2 border-slate-200 rounded-full flex justify-center items-center relative">
                  <input
                    type="radio"
                    id="month"
                    name="duration-unit"
                    className="hidden peer"
                    value={"month"}
                  />
                  <div className="w-full h-full absolute bg-transparent border-blue-300 border-0 peer-checked:border-2 transition-colors rounded-full"></div>
                  <div className="w-4 h-4 bg-blue-600 scale-0  peer-checked:scale-100 transition-transform rounded-full"></div>
                </label>
                <span>Tháng</span>
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="year"
                  className="cursor-pointer h-8 w-8 bg-slate-100 border-2 border-slate-200 rounded-full flex justify-center items-center relative">
                  <input
                    type="radio"
                    id="year"
                    name="duration-unit"
                    className="hidden peer"
                    value={"year"}
                  />
                  <div className="w-full h-full absolute bg-transparent border-blue-300 border-0 peer-checked:border-2 transition-colors rounded-full"></div>
                  <div className="w-4 h-4 bg-blue-600 scale-0  peer-checked:scale-100 transition-transform rounded-full"></div>
                </label>
                <span>Năm</span>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="startDate"
                  className="after:content-['*'] after:text-red-500">
                  Bắt đầu từ:{" "}
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="border-2 border-slate-200 px-2 py-1 rounded outline-none cursor-pointer"
                />
              </div>
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="endDate"
                  className="after:content-['*'] after:text-red-500">
                  Kết thúc vào:{" "}
                </label>
                <input
                  type="date"
                  id="endDate"
                  className="border-2 border-slate-200 px-2 py-1 rounded outline-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <h1 className="after:content-['*'] after:text-red-500">
                Loại thời khóa biểu:{"  "}
              </h1>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="fixedSchedule"
                  className="cursor-pointer h-8 w-8 bg-slate-100 border-2 border-slate-200 rounded-full flex justify-center items-center relative">
                  <input
                    type="radio"
                    id="fixedSchedule"
                    name="schedule-type"
                    className="hidden peer"
                    value={"fixedSchedule"}
                  />
                  <div className="w-full h-full absolute bg-transparent border-blue-300 border-0 peer-checked:border-2 transition-colors rounded-full"></div>
                  <div className="w-4 h-4 bg-blue-600 scale-0  peer-checked:scale-100 transition-transform rounded-full"></div>
                </label>
                <span>Cố định</span>
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="flexSchedule"
                  className="cursor-pointer h-8 w-8 bg-slate-100 border-2 border-slate-200 rounded-full flex justify-center items-center relative">
                  <input
                    type="radio"
                    id="flexSchedule"
                    name="schedule-type"
                    className="hidden peer"
                    value={"flexSchedule"}
                  />
                  <div className="w-full h-full absolute bg-transparent border-blue-300 border-0 peer-checked:border-2 transition-colors rounded-full"></div>
                  <div className="w-4 h-4 bg-blue-600 scale-0  peer-checked:scale-100 transition-transform rounded-full"></div>
                </label>
                <span>Linh hoạt</span>
              </div>
            </div>
            <div className="text-xs text-slate-500 flex flex-col gap-1">
              <span className="font-bold">Chú thích</span>
              <div>
                - Thời khóa biểu <span className="font-bold">cố định</span>: Các ngày trong tuần đều có cùng một/nhiều khung giờ học
              </div>
              <div>
                - Thời khóa biểu <span className="font-bold">linh hoạt</span>: Các ngày khác nhau trong tuần có thể có các khung giờ học khác nhau
              </div>
            </div>
          </div>
          
        </div>
        <div className="flex flex-col gap-2 px-3">
          <button
            onClick={context.nextStep}
            type="button"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-800 transition-colors text-white text-sm rounded">
            Tiếp theo
          </button>
          <button
            onClick={context.prevStep}
            type="button"
            className="px-6 py-3 bg-slate-400 hover:bg-slate-500 transition-colors text-white text-sm rounded">
            Trở lại
          </button>
        </div>
      </div>
    </div>
  );
};

const FixedScheduleSelector = () => {
  const context = useSlider();
  return (
    <div className="flex flex-col">
      <h1 className="text-center font-medium text-lg">
        Thành lập thời khóa biểu cố định
      </h1>
      <div className="grid grid-cols-3 divide-x-2 divide-slate-200 mt-4">
        <div className="col-span-2 px-10">
          
        </div>
        <div className="flex flex-col gap-2 px-3">
          <button
            onClick={context.nextStep}
            type="button"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-800 transition-colors text-white text-sm rounded">
            Tiếp theo
          </button>
          <button
            onClick={context.prevStep}
            type="button"
            className="px-6 py-3 bg-slate-400 hover:bg-slate-500 transition-colors text-white text-sm rounded">
            Trở lại
          </button>
        </div>
      </div>
    </div>
  );
};

const FlexScheduleSelector = () => {
  const context = useSlider();
  return (
    <div className="flex flex-col">
      <h1 className="text-center font-medium text-lg">
        Thành lập thời khóa biểu linh hoạt
      </h1>
      <div className="grid grid-cols-3 divide-x-2 divide-slate-200 mt-4">
        <div className="col-span-2 px-10">
          
        </div>
        <div className="flex flex-col gap-2 px-3">
          <button
            onClick={context.nextStep}
            type="button"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-800 transition-colors text-white text-sm rounded">
            Tiếp theo
          </button>
          <button
            onClick={context.prevStep}
            type="button"
            className="px-6 py-3 bg-slate-400 hover:bg-slate-500 transition-colors text-white text-sm rounded">
            Trở lại
          </button>
        </div>
      </div>
    </div>
  );
};
