"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { IoChevronBackOutline } from "react-icons/io5";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Branch } from "@/app/types/type";
import { setSelectedBranch, setBranches } from "@/app/store/branch-slice";
import { RootState } from "@/app/store/store";
import {
  getAllBranches,
  getListClerk,
  getAvailableClerks,
} from "@/app/lib/services/branch";
import { Button } from "@/app/ui/components/_common/Button";

type Clerk = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  gender: string;
};

const BranchDetail = () => {
  const { branches } = useSelector((state: RootState) => state.branch);
  const [branches_, setBranches_] = useState<Branch[]>(branches);
  const { branchID } = useParams();
  const [branch, setBranch] = useState<Branch>();
  const [clerks, setClerks] = useState<Clerk[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isExiting, setIsExiting] = useState(false); // Track exit animation
  const [availableClerks, setAvailableClerks] = useState<Clerk[]>([]);
  const [selectedClerks, setSelectedClerks] = useState<Clerk[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (branches.length > 0) return;
    const fetchBranches = async () => {
      try {
        const response = await getAllBranches(0, 100);
        const modifiedData = response.data.content.sort(
          (a: Branch, b: Branch) => a.name.localeCompare(b.name),
        );
        setBranches_(modifiedData);
        dispatch(setBranches(modifiedData));

        if (modifiedData.length > 0) {
          dispatch(setSelectedBranch(modifiedData[0].id));
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    if (!branchID) return;
    const branch = branches_.find((branch) => branch.id === branchID);
    setBranch(branch);
  }, [branchID, branches_]);

  useEffect(() => {
    if (!branchID) return;
    const fetchClerks = async () => {
      try {
        const response = await getListClerk(branchID as string);
        setClerks(response.data.content);
      } catch (error) {
        console.error("Failed to fetch clerks:", error);
      }
    };
    fetchClerks();
  }, [branchID]);

  const handleBack = () => {
    setIsExiting(true); // Trigger exit animation
    setTimeout(() => {
      router.push("/admin/branches");
    }, 500); // Wait for animation to complete
  };

  const getAvailableClerk = async () => {
    try {
      const response = await getAvailableClerks();
      setAvailableClerks(response.data);
    } catch (error) {
      console.error("Failed to fetch available clerks:", error);
    }

    // Show modal
    setShowModal(true);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="flex flex-col px-2 gap-2"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ duration: 0.75, ease: "easeInOut" }}
        >
          <div className="flex justify-between items-center">
            <div
              className="flex w-fit h-fit items-center cursor-pointer p-2 rounded-full bg-primary-light text-black hover:bg-primary hover:shadow-md"
              onClick={handleBack}
            >
              <IoChevronBackOutline />
            </div>
            {branch && (
              <div className="flex items-center justify-center gap-2 text-2xl font-semibold">
                {branch.name}
              </div>
            )}
            <div className="flex items-center cursor-pointer p-2 rounded-full bg-gray-200 text-red-500 hover:bg-gray-300 hover:text-red-600 hover:shadow-md">
              <FaTrashAlt className="w-5 h-5" />
            </div>
          </div>

          <div className="flex flex-col mt-4 gap-2 justify-center items-start text-lg w-[50%] mx-auto">
            <table className="min-w-full table-auto border-collapse rounded-lg">
              <tbody>
                <tr className="border-b bg-white">
                  <td className="px-3 py-4 font-semibold">Địa chỉ:</td>
                  <td className="px-3 py-4 flex justify-between items-center">
                    {branch?.address}
                    <FaEdit className="text-primary-dark hover:text-primary-darker cursor-pointer" />
                  </td>
                </tr>
                <tr className="border-b bg-white">
                  <td className="px-3 py-4 font-semibold">Số điện thoại:</td>
                  <td className="px-3 py-4 flex justify-between items-center">
                    {branch?.contactNumber}
                    <FaEdit className="text-primary-dark hover:text-primary-darker cursor-pointer" />
                  </td>
                </tr>
                <tr className="border-b bg-white">
                  <td className="px-3 py-4 font-semibold">Số phòng học:</td>
                  <td className="px-3 py-4 flex justify-between items-center">
                    {branch?.rooms}
                    <FaEdit className="text-primary-dark hover:text-primary-darker cursor-pointer" />
                  </td>
                </tr>
                <tr className="border-b bg-white">
                  <td className="px-3 py-4 font-semibold">Ca học:</td>
                  <td className="px-3 py-4 flex justify-between items-center">
                    <ul>
                      {[...(branch?.sessions || [])]
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map((session, index) => (
                          <li key={index}>
                            {session.name}: {session.startTime.slice(0, 5)}{" "}
                            {" - "}
                            {session.endTime.slice(0, 5)}
                          </li>
                        ))}
                    </ul>
                    <FaEdit className="text-primary-dark hover:text-primary-darker cursor-pointer" />
                  </td>
                </tr>
                <tr className="border-b bg-white">
                  <td className="px-3 py-4 font-semibold">Giáo vụ:</td>
                  <td className="px-3 py-4 flex justify-between items-center">
                    <ul>
                      {clerks?.map((clerk, index) => (
                        <li key={index}>02403004 - {clerk.name}</li>
                      ))}
                    </ul>
                    <FaEdit
                      className="text-primary-dark hover:text-primary-darker cursor-pointer"
                      onClick={getAvailableClerk}
                    />
                    {showModal && (
                      <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
                        <div className="bg-white p-8 rounded-xl shadow-lg w-96 max-w-lg">
                          <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">
                            Thêm giáo vụ
                          </h3>
                          <div className="flex flex-col gap-4">
                            {availableClerks.map((clerk, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedClerks.some(
                                    (s) => s.id === clerk.id,
                                  )}
                                  onChange={() =>
                                    setSelectedClerks((prev) =>
                                      prev.includes(clerk)
                                        ? prev.filter((c) => c.id !== clerk.id)
                                        : [...prev, clerk],
                                    )
                                  }
                                  className="h-3 w-3"
                                />
                                <span className="text-gray-700 text-[15px]">
                                  {clerk.name}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end mt-2 gap-4">
                            <Button
                              type="button"
                              className="bg-gray-200 hover:bg-gray-300 text-sm"
                              onClick={() => setShowModal(false)}
                            >
                              Hủy
                            </Button>
                            <Button type="submit" className="text-sm">
                              Thêm
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BranchDetail;
