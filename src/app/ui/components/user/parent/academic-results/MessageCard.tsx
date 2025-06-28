import { BsInfoCircle } from "react-icons/bs";

interface MessageCardProps {
  message: string;
}

export const MessageCard = ({ message }: MessageCardProps) => {
  return (
    <div className="flex items-center justify-center p-8 bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg">
      <div className="text-center">
        <BsInfoCircle className="mx-auto h-12 w-12 text-blue-400" />
        <p className="mt-4 text-lg font-medium text-blue-700">{message}</p>
      </div>
    </div>
  );
};
