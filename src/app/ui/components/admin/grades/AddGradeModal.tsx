"use client";

import React, { useState } from "react";
import { Input } from "@/app/ui/components/_common/text-field/Input";
import { Button } from "@/app/ui/components/_common/Button";
import { GradeSchema } from "@/app/types/type";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/app/ui/components/_common/Dialog";
import { createNewGrade } from "@/app/lib/services/grade";
import { useRouter } from "next/navigation";

interface ModalGradeWrapperProps {
  buttonLabel: string;
}

interface CreateGradeError {
  name?: string | null;
  creator?: string | null;
}

const AddGradeModal: React.FC<ModalGradeWrapperProps> = ({ buttonLabel }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    creator: localStorage.getItem("creator") || "",
  });

  const [errors, setErrors] = useState<CreateGradeError>({
    name: null,
    creator: null,
  });

  const router = useRouter();

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isValidForm = (data: GradeSchema): boolean => {
    let isValid = true;
    const msg = "Trường bắt buộc";
    const newErrors: CreateGradeError = {};

    if (!data.name) {
      newErrors.name = msg;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: GradeSchema = { ...formData };

    if (!isValidForm(payload)) {
      toast.error("Vui lòng kiểm tra lại các thông tin đã nhập!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      console.log(errors);
      return; // Stop further processing if validation fails
    }

    try {
      const response = await createNewGrade(payload);
      console.log(response);

      if (response.statusCode === "OK") {
        setFormData({
          name: "",
          creator: localStorage.getItem("creator") || "",
        });

        toast.success("Tạo khối học thành công! Đang chuyển hướng...", {
          position: "bottom-right",
          autoClose: 3000,
        });

        setShowModal(false);
        router.push("/admin/grades");
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      toast.error("Lỗi hệ thống. Vui lòng thử lại sau.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <Button onClick={handleOpenModal} className="pl-6 pr-6">
        {buttonLabel}
      </Button>

      <Dialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        className="w-[50vw]"
      >
        <DialogHeader>Tạo khối học mới</DialogHeader>
        <DialogContent>
          <form
            onSubmit={handleSubmitModal}
            className="space-y-6"
            id="add-course-admin-form"
          >
            {/*Creator*/}
            <Input
              type="text"
              name="creator"
              value={formData.creator}
              readOnly
              placeholder="Người tạo"
              label="Người tạo"
            />
            {/*Name*/}
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập tên khối"
              label="Tên khối *"
              required
            />
          </form>
        </DialogContent>
        <DialogFooter>
          {/*Buttons*/}
          <div className="flex justify-between">
            <Button
              variant="basic"
              onClick={handleCloseModal}
              className="bg-neutral hover:bg-neutral/80 text-primary-text w-[15%]"
            >
              Hủy
            </Button>
            <Button
              form="add-course-admin-form"
              type="submit"
              className="w-[15%]"
            >
              Lưu
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default AddGradeModal;
