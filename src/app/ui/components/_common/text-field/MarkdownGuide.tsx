"use client";
import React, { memo, useState } from "react";
import { Dialog, DialogContent } from "../Dialog";

const MarkdownGuide = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      <div
        className="text-sm text-gray-700 hover:text-primary-darkest cursor-pointer underline"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Hướng dẫn viết biểu thức toán
      </div>

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DialogContent>
          <div className="p-4 rounded-md bg-gray-50 border text-sm text-gray-800 space-y-4">
            <h2 className="font-semibold text-base text-primary-darkest">
              Hướng dẫn nhập biểu thức toán học
            </h2>

            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>1. Công thức trong dòng:</strong> Dùng{" "}
                <code>$...$</code> để hiển thị công thức toán học ngắn trong
                cùng dòng.
                <div className="mt-1">
                  <p>
                    Ví dụ: <code>$x + 2 = 5$</code>
                  </p>
                  <p>
                    Kết quả:{" "}
                    <span dangerouslySetInnerHTML={{ __html: "x + 2 = 5" }} />
                  </p>
                </div>
              </li>

              <li>
                <strong>2. Công thức hiển thị riêng:</strong> Dùng{" "}
                <code>$$...$$</code> để viết biểu thức toán học dạng block.
                <div className="mt-1">
                  <p>
                    Ví dụ:{" "}
                    <code>
                      $$\\frac{1}
                      {2} + \\frac{1}
                      {4} = \\frac{3}
                      {4}$$
                    </code>
                  </p>
                  <p>
                    Kết quả:{" "}
                    <span dangerouslySetInnerHTML={{ __html: "½ + ¼ = ¾" }} />
                  </p>
                </div>
              </li>

              <li>
                <strong>3. Nhân, chia:</strong> Dùng <code>\\times</code> cho
                dấu nhân (×), <code>\\div</code> cho chia (÷).
                <div className="mt-1">
                  <p>
                    Ví dụ: <code>$6 \\times 7 = 42$</code>
                  </p>
                  <p>Kết quả: 6 × 7 = 42</p>
                </div>
              </li>

              <li>
                <strong>4. Lũy thừa:</strong> Dùng <code>^</code> để viết số mũ.
                <div className="mt-1">
                  <p>
                    Ví dụ: <code>$x^2 + y^2 = z^2$</code>
                  </p>
                  <p>Kết quả: x² + y² = z²</p>
                </div>
              </li>

              <li>
                <strong>5. Căn bậc hai và tích phân:</strong> Dùng{" "}
                <code>\\sqrt{}</code> và <code>\\int</code>.
                <div className="mt-1">
                  <p>
                    Ví dụ: <code>$$\\sqrt{16} = 4$$</code>
                  </p>
                  <p>
                    Ví dụ: <code>$$\\int_0^1 x^2 dx$$</code>
                  </p>
                </div>
              </li>

              <li>
                <strong>6. Xuống dòng:</strong> Nhấn <kbd>Enter</kbd> hoặc dùng{" "}
                <code>\\n</code> khi viết trong chuỗi.
                <div className="mt-1">
                  <p>
                    Ví dụ:{" "}
                    <code>
                      {
                        "Phép cộng:\\n$1 + 2 = 3$\\nPhép nhân:\\n$4 \\times 5 = 20$"
                      }
                    </code>
                  </p>
                </div>
              </li>
            </ul>

            <p className="text-gray-600 italic">
              Mẹo: Bạn có thể sử dụng các biểu thức này khi viết câu hỏi, nội
              dung bài giảng hoặc đề kiểm tra.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default memo(MarkdownGuide);
