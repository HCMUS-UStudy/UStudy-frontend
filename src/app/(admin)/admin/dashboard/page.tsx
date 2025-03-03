import Image from "next/image";

const Card = ({
  title,
  description,
  img,
}: {
  title: string;
  description: string;
  img: { src: string; width: string; height: string };
}) => {
  return (
    <div className="flex w-full bg-white rounded-2xl shadow-md justify-between">
      <div className="flex flex-col gap-4 p-6 justify-center">
        <div className="text-2xl text-primary-darker">{description}</div>
        <div className="text-md text-gray-500">{title}</div>
      </div>
      <div className="flex items-center p-3 w-1/2 h-full">
        <Image
          className={`w-[${img.width}] h-[${img.height}]`}
          src={`/${img.src}`}
          width={100}
          height={100}
          alt={title}
        />
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex justify-between gap-4 items-center h-[120px]">
        <Card
          title="Số học sinh"
          description="100"
          img={{ src: "student.png", width: "100px", height: "100px" }}
        />
        <Card
          title="Số giáo viên"
          description="10"
          img={{ src: "teacher.png", width: "110px", height: "110px" }}
        />
        <Card
          title="Số chi nhánh"
          description="10"
          img={{ src: "branch.png", width: "110px", height: "110px" }}
        />
        <Card
          title="Số tài liệu"
          description="10"
          img={{ src: "files.png", width: "110px", height: "110px" }}
        />
      </div>

      <div className="flex gap-6">
        <div className="flex flex-col gap-4 w-1/3 h-full">
          <div className="bg-foreground flex flex-col gap-4 h-40 rounded-2xl shadow-md p-1">
            <div className="flex justify-center">Học phí</div>
          </div>

          <div className="bg-foreground flex flex-col gap-4 h-64 rounded-2xl shadow-md p-1">
            <div className="flex justify-center">Giáo viên tiêu biểu</div>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-2/3 h-full">
          <div className="bg-foreground flex flex-col gap-4 h-52 rounded-2xl shadow-md p-1">
            <div className="flex justify-center">Doanh thu</div>
          </div>

          <div className="flex gap-4 h-52">
            <div className="flex justify-center bg-foreground p-2 rounded-2xl shadow-md w-1/3">
              Truy cập mỗi ngày
            </div>
            <div className="flex justify-center bg-foreground p-2 rounded-2xl shadow-md w-2/3">
              Ngày nghỉ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
