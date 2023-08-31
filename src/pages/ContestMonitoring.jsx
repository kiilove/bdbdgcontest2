import React from "react";
import { useState } from "react";
import LoadingPage from "./LoadingPage";
import { TbHeartRateMonitor } from "react-icons/tb";

import { useContext } from "react";
import { CurrentContestContext } from "../contexts/CurrentContestContext";

import ContestMonitoringBasecamp from "./ContestMonitoringBasecamp";
import ContestMonitoringJudgeHead from "./ContestMonitoringJudgeHead";
import StandingTableType1 from "./StandingTableType1";
import ContestMonitoringStage from "./ContestMonitoringStage";

const ContestMonitoring = () => {
  const { currentContest } = useContext(CurrentContestContext);
  const [currentTab, setCurrentTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const tabArray = [
    {
      id: 0,
      title: "본부석 화면",
      children: "",
    },
    {
      id: 1,
      title: "심판위원장 화면",
      children: "",
    },
    {
      id: 2,
      title: "사회자 화면",
      children: "",
    },
    {
      id: 3,
      title: "전광판 화면",
      children: "",
    },
  ];

  return (
    <>
      {isLoading && <LoadingPage />}
      {!isLoading && (
        <div className="flex flex-col w-full h-full bg-white rounded-lg p-3 gap-y-2">
          <div className="flex w-full h-14">
            <div className="flex w-full bg-gray-100 justify-start items-center rounded-lg px-3">
              <div className="flex w-1/2">
                <span className="font-sans text-lg font-semibold w-6 h-6 flex justify-center items-center rounded-2xl bg-blue-400 text-white mr-3">
                  <TbHeartRateMonitor />
                </span>
                <h1
                  className="font-sans text-lg font-semibold"
                  style={{ letterSpacing: "2px" }}
                >
                  대회모니터링
                </h1>
              </div>
            </div>
          </div>
          <div className="flex w-full h-full ">
            <div className="flex w-full justify-start items-center">
              <div className="flex w-full h-full justify-start categoryIdart px-3 pt-3 flex-col bg-gray-100 rounded-lg">
                <div className="flex w-full">
                  {tabArray.map((tab, tIdx) => (
                    <>
                      <button
                        className={`${
                          currentTab === tab.id
                            ? " flex w-auto h-10 bg-white px-4"
                            : " flex w-auto h-10 bg-gray-100 px-4"
                        }  h-14 rounded-t-lg justify-center items-center`}
                        onClick={() => setCurrentTab(tIdx)}
                      >
                        <span>{tab.title}</span>
                      </button>
                    </>
                  ))}
                </div>
                {currentTab === 0 && <ContestMonitoringBasecamp />}
                {currentTab === 1 && <ContestMonitoringJudgeHead />}
                {currentTab === 2 && <ContestMonitoringStage />}
                {currentTab === 3 && <StandingTableType1 />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContestMonitoring;
