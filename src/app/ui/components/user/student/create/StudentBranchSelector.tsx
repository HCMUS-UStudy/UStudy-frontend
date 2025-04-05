import React, { useEffect, useState } from "react";
import Loading from "../../../_common/loading/Loading";
import { Select, SelectItem } from "../../../_common/Select";
import { getAllBranches } from "@/app/lib/services/branch";
import { Branch } from "@/app/types";
import { StudentRegisterInputs } from "@/app/register/page";
import { useFormContext } from "react-hook-form";

export default function StudentBranchSelector() {
  const {
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<StudentRegisterInputs>();
  const [loadingBranch, setLoadingBranch] = useState<boolean>(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoadingBranch(true);
        const gradesRes = await getAllBranches(0, 15);
        setBranches(gradesRes.content);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingBranch(false);
      }
    };
    fetchBranches();
    return;
  }, []);
  const handleSelectBranch = (branchId: string) => {
    setValue("branchId", branchId);
    clearErrors("branchId");
    setValue("classTimes", []);
  };
  return (
    <>
      {loadingBranch ? (
        <div className="px-2 py-0.5 flex justify-start border-2 border-slate-300 rounded-md">
          <Loading text="Chọn chi nhánh" />
        </div>
      ) : (
        <div>
          <Select
            name="BranchSelector"
            defaultLabel="Chọn chi nhánh"
            onValueChange={(branchId) => handleSelectBranch(branchId as string)}
          >
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name} - {branch.address}
              </SelectItem>
            ))}
          </Select>
          <span className="text-[13px] text-error">
            {errors.branchId?.message}
          </span>
        </div>
      )}
    </>
  );
}
