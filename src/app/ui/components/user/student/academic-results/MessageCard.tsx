import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { BsInfoCircle } from "react-icons/bs";

interface MessageCardProps {
  message: string;
}

export const MessageCard = ({ message }: MessageCardProps) => {
  return (
    <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BsInfoCircle className="h-5 w-5 text-primary-darker" />
          Thông báo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
};
