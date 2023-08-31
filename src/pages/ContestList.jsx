import React from "react";
import { LiaClipboardListSolid } from "react-icons/lia";

const ContestList = () => {
  return (
    <div className="flex flex-col w-full h-full bg-white rounded-lg p-3 gap-y-2 justify-start items-start">
      <div className="flex w-full h-14">
        <div className="flex w-full bg-gray-100 justify-start items-center rounded-lg px-3">
          <span className="font-sans text-lg font-semibold w-6 h-6 flex justify-center items-center rounded-2xl bg-blue-400 text-white mr-3">
            <LiaClipboardListSolid />
          </span>
          <h1
            className="font-sans text-lg font-semibold"
            style={{ letterSpacing: "2px" }}
          >
            대회목록
          </h1>
        </div>
      </div>
      <div className="flex w-full h-full items-start">
        <div className="flex w-full bg-gray-100 rounded-lg p-2 flex-col items-start justify-start">
          <h1
            className="text-base font-semibold"
            style={{ letterSpacing: "2px" }}
          >
            진행중인 대회
          </h1>
          <div className="flex w-full flex-wrap box-border overflow-auto">
            <div className="flex w-">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/bdbdgmain.appspot.com/o/images%2Fposter%2Fcompress%2Fbdbdg_1684842361004?alt=media&token=a8a289bd-3450-4d3a-8f2f-ab49289876ec"
                className="w-full object-cover object-top"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestList;
