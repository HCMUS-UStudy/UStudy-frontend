"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { IoChevronBackOutline } from "react-icons/io5";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Branch } from "@/app/types";
import { toast } from "react-toastify";
import { setSelectedBranch, setBranches } from "@/app/store/branch-slice";
import { RootState } from "@/app/store/store";
import {
  getAllBranches,
  getListClerk,
  getAvailableClerks,
  updateBranch,
  updateAdmins,
  updateSessions,
} from "@/app/lib/services/branch";
import { getSession } from "@/app/lib/services/session";
// import { Button } from "@/app/ui/components/_common/Button";
import ClerkModal from "@/app/ui/components/admin/branches/ClerkModal";
import EditSessionModal from "@/app/ui/components/admin/branches/EditSessionModal";
import { Input } from "@/app/ui/components/_common/text-field/Input";
import { FiCheck } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useEncodedRoute } from "@/app/lib/hooks";

type Clerk = {
  id: string;
  genId: string;
  name: string;
  email: string;
  avatar: string;
  gender: string;
};

type Session = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
};

const BranchDetail = () => {
  const { branches } = useSelector((state: RootState) => state.branch);
  const [branches_, setBranches_] = useState<Branch[]>(branches);
  // const params = useParams();
  // const branchID = (params?.branchID ?? "") as string;

  const params = useParams<{ branchID: string }>();
  const { decodeId } = useEncodedRoute();
  const branchID = decodeId(params?.branchID as string);

  const [branch, setBranch] = useState<Branch>();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isExiting, setIsExiting] = useState(false); // Track exit animation

  const [clerks, setClerks] = useState<Clerk[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  const [availableClerks, setAvailableClerks] = useState<Clerk[]>([]);
  const [searchClerks, setSearchClerks] = useState<Clerk[]>([]);
  const [selectedClerks, setSelectedClerks] = useState<Clerk[]>([]);

  const [listSessions, setListSessions] = useState<Session[]>([]);
  const [searchSessions, setSearchSessions] = useState<Session[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<Session[]>([]);

  const [showClerkModal, setShowClerkModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingContactNumber, setIsEditingContactNumber] = useState(false);
  const [editedAddress, setEditedAddress] = useState("");
  const [editedContactNumber, setEditedContactNumber] = useState("");

  useEffect(() => {
    if (branches.length > 0) return;
    const fetchBranches = async () => {
      try {
        const response = await getAllBranches(0, 100);
        const modifiedData = response.content.sort((a: Branch, b: Branch) =>
          a.name.localeCompare(b.name),
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
  }, [branches.length, dispatch]);

  useEffect(() => {
    if (!branchID) return;
    const branch = branches_.find((branch) => branch.id === branchID);
    setBranch(branch);

    setEditedAddress(branch?.address || "");
    setEditedContactNumber(branch?.contactNumber || "");
    setSessions(branch?.sessions || []);
    setSelectedSessions(branch?.sessions || []);
  }, [branchID, branches_]);

  useEffect(() => {
    if (!branchID) return;
    const fetchClerks = async () => {
      try {
        const response = await getListClerk(branchID as string);
        setClerks(response.data.content);
        setSelectedClerks(response.data.content);
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
      const selectedIds = new Set(selectedClerks.map((clerk) => clerk.id));
      const sortedClerks = response.data.sort((a: Clerk, b: Clerk) => {
        if (selectedIds.has(a.id) && !selectedIds.has(b.id)) return -1;
        if (!selectedIds.has(a.id) && selectedIds.has(b.id)) return 1;
        return 0;
      });
      setAvailableClerks(sortedClerks);
      setSearchClerks(sortedClerks);
    } catch (error) {
      console.error("Failed to fetch available clerks:", error);
    }

    setShowClerkModal(true);
  };

  const getSessions = async () => {
    try {
      const response = await getSession(0, 100);
      response.content.sort((a: Session, b: Session) =>
        a.startTime.localeCompare(b.startTime),
      );

      const selectedIds = new Set(
        selectedSessions.map((session) => session.id),
      );
      const sortedSessions = response.content.sort((a: Session, b: Session) => {
        if (selectedIds.has(a.id) && !selectedIds.has(b.id)) return -1;
        if (!selectedIds.has(a.id) && selectedIds.has(b.id)) return 1;
        return 0;
      });

      setListSessions(sortedSessions);
      setSearchSessions(sortedSessions);
    } catch (error) {
      console.error("Failed to fetch time:", error);
    }

    setShowSessionModal(true);
  };

  const handleUpdateBranch = async () => {
    const updatedData = {
      id: branchID as string,
      name: branch?.name || "",
      address: editedAddress,
      contactNumber: editedContactNumber,
    };
    try {
      await updateBranch(updatedData);
      toast.success("Cập nhật chi nhánh thành công", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: false,
        closeOnClick: true,
      });
      setBranch(
        (prev) =>
          prev && {
            ...prev,
            address: editedAddress,
            contactNumber: editedContactNumber,
          },
      );
    } catch (error) {
      console.error("Failed to update branch:", error);
      toast.error("Cập nhật chi nhánh thất bại", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: false,
        closeOnClick: true,
      });
      setEditedAddress(branch?.address || "");
      setEditedContactNumber(branch?.contactNumber || "");
    }
  };

  const handleUpdateAdmins = async () => {
    const updatedData = {
      branchId: branchID as string,
      clerkIds: selectedClerks.map((clerk) => clerk.id),
    };
    try {
      await updateAdmins(updatedData.branchId, updatedData.clerkIds);
      toast.success("Cập nhật danh sách thành công", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: false,
        closeOnClick: true,
      });
      setClerks(selectedClerks);
    } catch (error) {
      console.error("Failed to update branch:", error);
      toast.error("Cập nhật chi nhánh thất bại", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: false,
        closeOnClick: true,
      });
    }
  };

  const handleUpdateSessions = async () => {
    const updatedData = {
      branchId: branchID as string,
      sessions: selectedSessions.map((session) => session.id),
    };
    try {
      await updateSessions(updatedData.branchId, updatedData.sessions);
      toast.success("Cập nhật danh sách thành công", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: false,
        closeOnClick: true,
      });
      setSessions(selectedSessions);
    } catch (error) {
      console.error("Failed to update branch:", error);
      toast.error("Cập nhật chi nhánh thất bại", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: false,
        closeOnClick: true,
      });
    }
  };

  return (
    <>
      <div className="overflow-x-hidden">
        <AnimatePresence>
          {!isExiting && (
            <motion.div
              className="flex flex-col px-2 gap-2"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <div className="flex justify-between items-center">
                <div
                  className="flex w-fit h-fit items-center cursor-pointer p-2 rounded-full bg-primary-light text-black hover:bg-primary hover:shadow-md"
                  onClick={handleBack}
                >
                  <IoChevronBackOutline />
                </div>
                {branch && (
                  <div className="flex items-center justify-center pt-1 gap-2 text-2xl font-semibold">
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
                        {isEditingAddress ? (
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              className="text-[17px] text-black"
                              value={editedAddress}
                              onChange={(e) => setEditedAddress(e.target.value)}
                            />
                            <div className="flex gap-2 items-center">
                              <FiCheck
                                className="text-green-600 cursor-pointer text-2xl"
                                onClick={async () => {
                                  setIsEditingAddress(false);
                                  await handleUpdateBranch();
                                }}
                              />
                              <RxCross2
                                className="text-red-500 cursor-pointer text-2xl"
                                onClick={() => {
                                  setIsEditingAddress(false);
                                  setEditedAddress(branch?.address || "");
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          editedAddress
                        )}
                        <FaEdit
                          className="text-primary-dark hover:text-primary-darker cursor-pointer"
                          onClick={() => setIsEditingAddress(true)}
                        />
                      </td>
                    </tr>
                    <tr className="border-b bg-white">
                      <td className="px-3 py-4 font-semibold">
                        Số điện thoại:
                      </td>
                      <td className="px-3 py-4 flex justify-between items-center">
                        {isEditingContactNumber ? (
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              className="text-[17px] text-black"
                              value={editedContactNumber}
                              onChange={(e) =>
                                setEditedContactNumber(e.target.value)
                              }
                            />
                            <div className="flex gap-2 items-center">
                              <FiCheck
                                className="text-green-600 cursor-pointer text-2xl"
                                onClick={async () => {
                                  setIsEditingContactNumber(false);
                                  await handleUpdateBranch();
                                }}
                              />
                              <RxCross2
                                className="text-red-500 cursor-pointer text-2xl"
                                onClick={() => {
                                  setIsEditingContactNumber(false);
                                  setEditedContactNumber(
                                    branch?.contactNumber || "",
                                  );
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          editedContactNumber
                        )}
                        <FaEdit
                          className="text-primary-dark hover:text-primary-darker cursor-pointer"
                          onClick={() => setIsEditingContactNumber(true)}
                        />
                      </td>
                    </tr>
                    <tr className="border-b bg-white">
                      <td className="px-3 py-4 font-semibold">Số phòng học:</td>
                      <td className="px-3 py-4 flex justify-between items-center">
                        {branch?.rooms}
                      </td>
                    </tr>
                    <tr className="border-b bg-white">
                      <td className="px-3 py-4 font-semibold">Ca học:</td>
                      <td className="px-3 py-4 flex justify-between items-center">
                        {sessions.length == 0 ? (
                          <div className="italic">Chưa có ca học</div>
                        ) : (
                          <ul>
                            {[...(sessions || [])]
                              .sort((a, b) =>
                                a.startTime.localeCompare(b.startTime),
                              )
                              .map((session, index) => (
                                <li key={index}>
                                  {session.name}:{" "}
                                  {session.startTime.slice(0, 5)} {" - "}{" "}
                                  {session.endTime.slice(0, 5)}
                                </li>
                              ))}
                          </ul>
                        )}
                        <FaEdit
                          className="text-primary-dark hover:text-primary-darker cursor-pointer"
                          onClick={getSessions}
                        />
                        {showSessionModal && (
                          <EditSessionModal
                            handleSubmit={handleUpdateSessions}
                            sessions={sessions}
                            listSessions={listSessions}
                            searchSessions={searchSessions}
                            setSearchSessions={setSearchSessions}
                            selectedSessions={selectedSessions}
                            setSelectedSessions={setSelectedSessions}
                            setShowSessionModal={setShowSessionModal}
                          />
                        )}
                      </td>
                    </tr>
                    <tr className="border-b bg-white">
                      <td className="px-3 py-4 font-semibold">Giáo vụ:</td>
                      <td className="px-3 py-4 flex justify-between items-center">
                        {clerks.length === 0 ? (
                          <div className="italic"> Chưa có giáo vụ </div>
                        ) : (
                          <ul className="max-h-[190px] overflow-y-auto pr-16">
                            {clerks?.map((clerk, index) => (
                              <li key={index}>
                                {clerk.genId} - {clerk.name}
                              </li>
                            ))}
                          </ul>
                        )}
                        <FaEdit
                          className="text-primary-dark hover:text-primary-darker cursor-pointer"
                          onClick={getAvailableClerk}
                        />
                        {showClerkModal && (
                          <ClerkModal
                            handleSubmit={handleUpdateAdmins}
                            clerks={clerks}
                            availableClerks={availableClerks}
                            searchClerks={searchClerks}
                            setSearchClerks={setSearchClerks}
                            selectedClerks={selectedClerks}
                            setSelectedClerks={setSelectedClerks}
                            setShowClerkModal={setShowClerkModal}
                          />
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default BranchDetail;
