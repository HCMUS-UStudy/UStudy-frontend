"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { IoChevronBackOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { getBranchById, updateBranch } from "@/app/lib/services/branch";
import { Input } from "@/app/ui/components/_common/text-field/Input";
import { FiCheck } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import EditClerks from "@/app/ui/components/admin/branches/EditClerks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loading } from "@/app/ui/components/_common/loading";
import EditSessions from "@/app/ui/components/admin/branches/EditSessions";

const BranchDetail = () => {
  const pathname = usePathname();
  const branchID = pathname?.split("/")[3] || "";

  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false); // Track exit animation

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingContactNumber, setIsEditingContactNumber] = useState(false);

  const [updatedBranch, setUpdatedBranch] = useState<{
    name: string;
    address: string;
    contactNumber: string;
  }>({ name: "aeafae", address: "", contactNumber: "" });

  const { addToast } = useCustomToast();

  const { data: branchDetail, status } = useQuery({
    queryKey: ["BranchDetail", branchID],
    queryFn: () => getBranchById(branchID),
    enabled: branchID !== "",
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (status === "success") {
      setUpdatedBranch({
        name: branchDetail.name,
        address: branchDetail.address,
        contactNumber: branchDetail.contactNumber,
      });
    }
  }, [branchDetail, status]);

  // useEffect(() => {
  //   if (branches.length > 0) return;
  //   const fetchBranches = async () => {
  //     try {
  //       const response = await getAllBranches(0, 100);
  //       const modifiedData = response.content.sort((a: Branch, b: Branch) =>
  //         a.name.localeCompare(b.name),
  //       );
  //       setBranches_(modifiedData);
  //       dispatch(setBranches(modifiedData));
  //       if (modifiedData.length > 0) {
  //         dispatch(setSelectedBranch(modifiedData[0].id));
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch branches:", error);
  //     }
  //   };
  //   fetchBranches();
  // }, [branches.length, dispatch]);

  // useEffect(() => {
  //   if (!branchID) return;
  //   const branch = branches_.find((branch) => branch.id === branchID);
  //   setBranch(branch);

  //   setEditedAddress(branch?.address || "");
  //   setEditedContactNumber(branch?.contactNumber || "");
  //   setSessions(branch?.sessions || []);
  //   // setSelectedSessions(branch?.sessions || []);
  // }, [branchID, branches_]);

  // const { data: clerks, status: clerksStatus } = useQuery({
  //   queryKey: ["Admins", branchID],
  //   queryFn: () => getListClerk(branchID),
  //   refetchOnWindowFocus: false,
  //   enabled: branchID !== "",
  // });

  const handleBack = () => {
    setIsExiting(true); // Trigger exit animation
    setTimeout(() => {
      router.push("/admin/branches");
    }, 500); // Wait for animation to complete
  };
  const queryClient = useQueryClient();
  const updateBranchMutation = useMutation({
    mutationFn: (data: {
      id: string;
      name: string;
      address: string;
      contactNumber: string;
    }) => updateBranch(data),
    onError: () => {
      addToast.error("Cập nhật chi nhánh thất bại");
      setIsEditingAddress(false);
      setIsEditingContactNumber(false);
    },
    onSuccess: () => {
      addToast.success("Cập nhật chi nhánh thành công");
      queryClient.invalidateQueries({ queryKey: ["BranchDetail"] });
      setIsEditingAddress(false);
      setIsEditingContactNumber(false);
    },
  });

  // const handleUpdateBranch = async () => {
  //   const updatedData = {
  //     id: branchID as string,
  //     name: branch?.name || "",
  //     address: editedAddress,
  //     contactNumber: editedContactNumber,
  //   };
  //   try {
  //     await updateBranch(updatedData);
  //     addToast.success("Cập nhật chi nhánh thành công");
  //     setBranch(
  //       (prev) =>
  //         prev && {
  //           ...prev,
  //           address: editedAddress,
  //           contactNumber: editedContactNumber,
  //         },
  //     );
  //   } catch (error) {
  //     console.error("Failed to update branch:", error);
  //     addToast.error("Cập nhật chi nhánh thất bại");
  //     setEditedAddress(branch?.address || "");
  //     setEditedContactNumber(branch?.contactNumber || "");
  //   }
  // };

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
                <div className="flex items-center justify-center pt-1 gap-2 text-2xl font-semibold">
                  {status === "pending" ? (
                    <>
                      <div>Đang tải dữ liệu</div>
                      <Loading />
                    </>
                  ) : (
                    <>{branchDetail?.name || ""} </>
                  )}
                </div>
                <div className="flex items-center cursor-pointer  rounded-full bg-gray-200 text-red-500 hover:bg-gray-300 hover:text-red-600 hover:shadow-md"></div>
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
                              value={updatedBranch.address}
                              onChange={(e) => {
                                setUpdatedBranch((prev) => ({
                                  ...prev,
                                  address: e.target.value,
                                }));
                              }}
                            />
                            <div className="flex gap-2 items-center">
                              <FiCheck
                                className="text-green-600 cursor-pointer text-2xl"
                                onClick={() => {
                                  setIsEditingAddress(false);
                                  // await handleUpdateBranch();
                                  updateBranchMutation.mutate({
                                    id: branchID,
                                    name: updatedBranch.name,
                                    address: updatedBranch.address,
                                    contactNumber: updatedBranch.contactNumber,
                                  });
                                }}
                              />
                              <RxCross2
                                className="text-red-500 cursor-pointer text-2xl"
                                onClick={() => {
                                  setIsEditingAddress(false);
                                  setUpdatedBranch({
                                    name: branchDetail?.name || "",
                                    address: branchDetail?.address || "",
                                    contactNumber:
                                      branchDetail?.contactNumber || "",
                                  });
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <>{updatedBranch.address}</>
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
                              value={updatedBranch.contactNumber}
                              onChange={(e) => {
                                setUpdatedBranch((prev) => ({
                                  ...prev,
                                  contactNumber: e.target.value,
                                }));
                              }}
                            />
                            <div className="flex gap-2 items-center">
                              <FiCheck
                                className="text-green-600 cursor-pointer text-2xl"
                                onClick={async () => {
                                  setIsEditingContactNumber(false);
                                  // await handleUpdateBranch();

                                  updateBranchMutation.mutate({
                                    id: branchID,
                                    name: updatedBranch.name,
                                    address: updatedBranch.address,
                                    contactNumber: updatedBranch.contactNumber,
                                  });
                                }}
                              />
                              <RxCross2
                                className="text-red-500 cursor-pointer text-2xl"
                                onClick={() => {
                                  setIsEditingContactNumber(false);
                                  // setEditedContactNumber(
                                  //   branch?.contactNumber || "",
                                  // );
                                  setUpdatedBranch({
                                    name: branchDetail?.name || "",
                                    address: branchDetail?.address || "",
                                    contactNumber:
                                      branchDetail?.contactNumber || "",
                                  });
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <>{updatedBranch.contactNumber}</>
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
                        {branchDetail?.numRooms}
                      </td>
                    </tr>
                    <tr className="border-b bg-white">
                      <td className="px-3 py-4 font-semibold">Ca học:</td>
                      <td className="px-3 py-4 flex justify-between items-center">
                        {branchDetail?.sessions.length == 0 ? (
                          <div className="italic">Chưa có ca học</div>
                        ) : (
                          <ul>
                            {[...(branchDetail?.sessions || [])]
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
                        <EditSessions
                          oldSessions={branchDetail?.sessions || []}
                        />
                      </td>
                    </tr>
                    <tr className="border-b bg-white">
                      <td className="px-3 py-4 font-semibold">Giáo vụ:</td>
                      <td className="px-3 py-4 flex justify-between items-center">
                        {status === "pending" ? (
                          <Loading />
                        ) : status === "success" ? (
                          <>
                            {branchDetail.admins.length === 0 ? (
                              <div className="italic"> Chưa có giáo vụ </div>
                            ) : (
                              <ul className="max-h-[190px] overflow-y-auto pr-16">
                                {branchDetail.admins.map((clerk, index) => (
                                  <li key={index}>
                                    {clerk.genId} - {clerk.name}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                        <EditClerks />
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
