"use client";

import React, { useState } from "react";

type FileType = { name: string; type: string; url: string };

const fileData: { solution: FileType[]; exercise: FileType[]; documents: FileType[] } = {
  solution: [
    { name: "Solution 1", type: "docx", url: "https://docs.google.com/document/d/1mF_10zGuSpUJpXuIGOnwafG77TKVGgZO/edit?usp=sharing&ouid=102081458260140726311&rtpof=true&sd=true" },
    { name: "Solution 2", type: "pdf", url: "/document.pdf" },
  ],
  exercise: [
    { name: "Exercise 1", type: "image", url: "/test.jpg" },
    { name: "Exercise 2", type: "image", url: "/icons/test.png" },
  ],
  documents: [
    { name: "Document 1", type: "pdf", url: "/document1.pdf" },
    { name: "Document 2", type: "docx", url: "/document2.docx" },
  ],
};

export default function TestPage() {
  const [activeTab, setActiveTab] = useState<keyof typeof fileData>("solution");

  const [activeBottomTab, setActiveBottomTab] = useState("work");

  const renderFile = (file: FileType) => {
    switch (file.type) {
      case "docx":
        return (
          <div className="flex items-center space-x-2">
            <img src="/icons/word.png" alt="Word Icon" className="w-6 h-6" />
            <span>{file.name}</span>
          </div>
        );
      case "pdf":
        return (
          <div className="flex items-center space-x-2">
            <img src="/icons/pdf.png" alt="PDF Icon" className="w-6 h-6" />
            <span>{file.name}</span>
          </div>
        );
      case "image":
        return (
          <div className="flex items-center space-x-2">
            <img src={file.url} alt={file.name} className="w-5 h-5 object-cover" />
            <span>{file.name}</span>
          </div>
        );
      default:
        return <div>Unsupported file type</div>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-tr from-blue-50 via-white to-gray-100 rounded-3xl">
      {/* Body Content */}
      <div className="w-full mx-auto p-2 bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-lg">
        <iframe
          src="/document.pdf"
          className="w-full h-screen"
          title="PDF Document Viewer"
          frameBorder="0"
        />
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-gradient-to-br from-indigo-100 via-white to-gray-50 shadow-lg border-l border-gray-300 p-6 rounded-l-lg rounded-r-lg flex flex-col space-y-6 min-h-screen">
        {/* Top Section: Tab Navigation */}
        <div className="flex-1 flex flex-col justify-between border-b border-gray-300 pb-6">
          <div className="mb-6">
            <div className="flex justify-between space-x-2 mb-4">
              {["solution", "exercise", "documents"].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold ${activeTab === tab
                    ? "bg-indigo-500 text-white shadow-md"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  onClick={() => setActiveTab(tab as "solution" | "exercise" | "documents")}
                >
                  {tab === "solution"
                    ? "Lời giải"
                    : tab === "exercise"
                      ? "Đề bài"
                      : "Tài liệu"}
                </button>
              ))}
            </div>

            {/* Top Section Content */}
            <div className="bg-white rounded-lg p-4 shadow-md space-y-4 flex-1">
              {fileData[activeTab].map((file, index) => (
                <div key={index}>{renderFile(file)}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Tab Navigation */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between space-x-2">
              {["work", "notes"].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold ${activeBottomTab === tab
                    ? "bg-indigo-500 text-white shadow-md"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  onClick={() => setActiveBottomTab(tab)}
                >
                  {tab === "work" ? "Bài làm" : "Ghi chú"}
                </button>
              ))}
            </div>

            {/* Bottom Section Content */}
            <div className="bg-white-300 rounded-lg p-4 shadow-md space-y-4 mt-4">
              {activeBottomTab === "work" && (
                <div>
                  <div className="grid gap-4">
                    {fileData.exercise.map((file, index) => (
                      <div key={index} className="flex flex-col">
                        {renderFile(file)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeBottomTab === "notes" && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Ghi chú</h3>
                  <p className="text-sm text-gray-600">Không có ghi chú nào.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
