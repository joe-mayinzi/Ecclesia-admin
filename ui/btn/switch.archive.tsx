import { Tabs, Tab, Chip } from "@nextui-org/react";
import { PiListLight } from "react-icons/pi";
import { RiMenu2Fill } from "react-icons/ri";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { HiCheck } from "react-icons/hi";

export default function BtnSwitchArchive({ state, setState }: { state: boolean, setState: React.Dispatch<React.SetStateAction<boolean>> }) {

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        size="sm"
        color="primary"
        variant="bordered"
        selectedKey={state ? "liste" : "card"}
        onSelectionChange={(k) => { setState(k === "liste") }}
      >
        <Tab
          key="liste"
          title={
            <div className="flex items-center justify-center gap-4">
              {state && <HiCheck size={20} />}
              <PiListLight size={20} />
            </div>
          }
        />
        <Tab
          key="card"
          title={
            <div className="flex items-center justify-center gap-4">
              {!state && <HiCheck size={20} />}
              <HiOutlineSquares2X2 size={20} />
            </div>
          }
        />
      </Tabs>
    </div>
  );
}