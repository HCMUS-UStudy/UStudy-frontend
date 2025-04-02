import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { Button } from "../../_common/Button";
import { toast } from "react-toastify";
import Checkbox from "../../_common/Checkbox";

const QuizModal = ({
  setQuizModal,
}: {
  setQuizModal: (value: boolean) => void;
}) => {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([
    { text: "", correct: false },
    { text: "", correct: false },
    { text: "", correct: false },
    { text: "", correct: false },
  ]);
  // const [timeLimit, setTimeLimit] = useState<number>(1);
  // const [points, setPoints] = useState(1);

  const addAnswer = () => {
    if (answers.length < 6) {
      setAnswers([...answers, { text: "", correct: false }]);
    } else {
      toast.error("Tối đa 6 đáp án.");
    }
  };

  const removeAnswer = (index: number) => {
    if (answers.length > 2) {
      const newAnswers = answers.filter((_, i) => i !== index);
      setAnswers(newAnswers);
    } else {
      toast.error("Cần ít nhất 2 đáp án.");
    }
  };

  const updateAnswer = (index: number, text: string) => {
    const newAnswers = [...answers];
    newAnswers[index].text = text;
    setAnswers(newAnswers);
  };

  const toggleCorrect = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[index].correct = !newAnswers[index].correct;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setQuizModal(false);
  };

  return (
    <div
      className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={() => setQuizModal(false)}
    >
      <div
        className="bg-white p-5 rounded-lg w-3/5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between pb-3 border-b">
          <h1 className="text-lg font-bold">Tạo câu hỏi</h1>
          <RxCross1
            className="cursor-pointer"
            onClick={() => setQuizModal(false)}
          />
        </div>
        <div className="mt-3">
          <label className="font-medium">Câu hỏi</label>
          <textarea
            className="w-full bg-gray-100 rounded p-2 mt-1 min-h-11 max-h-32 focus:outline-none"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        <div className="mt-3">
          <label className="font-medium pr-2 border-r">Trả lời</label>
          {answers.map((answer, index) => (
            <div key={index} className="flex items-center gap-4 mt-2">
              <Checkbox
                checked={answer.correct}
                onChange={() => toggleCorrect(index)}
                disabled={
                  answers.filter((a) => a.correct).length >= 1 &&
                  !answer.correct
                }
                className="rounded-full"
              />
              <input
                type="text"
                className="flex-1 text-[12px] bg-gray-100 rounded py-2 px-3 focus:outline-none"
                value={answer.text}
                onChange={(e) => updateAnswer(index, e.target.value)}
              />
              <button
                className="text-red-500"
                onClick={() => removeAnswer(index)}
              >
                Xóa
              </button>
            </div>
          ))}
          <Button
            className="mt-4 ml-6 text-sm bg-foreground hover:bg-slate-100 border border-gray-400 border-dashed"
            onClick={addAnswer}
          >
            + Thêm đáp án
          </Button>
        </div>
        {/* <div className="mt-3 flex gap-3">
          <div className="flex-1">
            <label className="font-medium">Thời gian (phút)</label>
            <input
              type="number"
              className="w-full border rounded p-2 mt-1"
              value={timeLimit}
              onChange={(e) => setTimeLimit(parseInt(e.target.value))}
            />
          </div>
          <div className="flex-1">
            <label className="font-medium">Điểm số</label>
            <input
              type="number"
              className="w-full border rounded p-2 mt-1"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value))}
            />
          </div>
        </div> */}
        <div className="flex justify-end mt-4 border-t pt-3">
          <Button
            className="bg-gray-200 px-4 py-2 rounded-lg"
            onClick={handleSubmit}
          >
            Lưu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
