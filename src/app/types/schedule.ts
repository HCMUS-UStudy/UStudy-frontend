export type ScheduleItem = {
  display: string;
  dataToSend: number;
  isChosen: boolean;
};

export const Schedule: ScheduleItem[] = [
  {
    display: "Thứ hai",
    dataToSend: 1,
    isChosen: false,
  },
  {
    display: "Thứ ba",
    dataToSend: 2,
    isChosen: false,
  },
  {
    display: "Thứ tư",
    dataToSend: 3,
    isChosen: false,
  },
  {
    display: "Thứ năm",
    dataToSend: 4,
    isChosen: false,
  },
  {
    display: "Thứ sáu",
    dataToSend: 5,
    isChosen: false,
  },
  {
    display: "Thứ bảy",
    dataToSend: 6,
    isChosen: false,
  },
  {
    display: "Chủ nhật",
    dataToSend: 7,
    isChosen: false,
  },
];

export type ScheduleType = "Giờ cố định" | "Giờ linh hoạt";
