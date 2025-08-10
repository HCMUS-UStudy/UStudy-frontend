import React from "react";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import remarkGfm from "remark-gfm";

interface MathMarkdownProps {
  content: string;
}

// const userInput = `Giải bài toán sau:

// Tìm giá trị của $x$ thỏa mãn phương trình:

// $$2x + 3 = 11$$

// Ngoài ra, hãy tính giá trị của biểu thức:

// $$\\frac{1}{2} + \\frac{3}{4}$$

// Phép nhân: $6 \\times 5 = 30$

// Phép chia: $20 \\div 4 = 5$

// Dòng mới sau đây sẽ thể hiện một tích phân:

// $$\\int_1^3 (2x + 1) \\, dx$$`;

const MarkdownInput: React.FC<MathMarkdownProps> = ({ content }) => {
  const processed = content.replace(/\n/g, "\n");

  return (
    <Markdown
      className="prose prose-li:marker:text-gray-800 text-base"
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
    >
      {processed}
    </Markdown>
  );
};

export default MarkdownInput;
