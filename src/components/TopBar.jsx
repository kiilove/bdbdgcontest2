import React, { useContext, useEffect, useMemo, useState } from "react";

import Drawer from "react-modern-drawer";
import { BsTrophyFill, BsInfoSquareFill } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import Drawbar from "./Drawbar";
import "react-modern-drawer/dist/index.css";
import {
  useFirestoreGetDocument,
  useFirestoreQuery,
} from "../hooks/useFirestores";
import { where } from "firebase/firestore";
import { CurrentContestContext } from "../contexts/CurrentContestContext";

const TopBar = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [contestList, setContestList] = useState([]);
  const [contestNoticeId, setContestNoticeId] = useState();
  const { currentContest, setCurrentContest } = useContext(
    CurrentContestContext
  );
  const fetchQuery = useFirestoreQuery();
  const fetchDocument = useFirestoreGetDocument("contest_notice");
  const handleDrawer = () => {
    setIsOpenDrawer((prev) => !prev);
    console.log(isOpenDrawer);
  };

  const handleCurrentContest = (e) => {};

  const fetchContestNotice = async () => {
    if (contestNoticeId) {
      const returnData = await fetchDocument.getDocument(contestNoticeId);

      if (returnData.id) {
        setCurrentContest({
          ...currentContest,
          contestInfo: { ...returnData },
        });
      }
    }
  };

  const fetchList = async () => {
    const condition = [where("contestStatus", "in", ["접수중", "대회종료"])];

    const returnData = await fetchQuery.getDocuments(
      "contest_notice",
      condition
    );
    console.log(returnData);

    setContestList([
      ...returnData.sort((a, b) =>
        a.contestTitle.localeCompare(b.contestTitle)
      ),
    ]);

    if (returnData?.length === 1) {
      setContestNoticeId(returnData[0].id);
    }
  };

  const fetchContest = async () => {
    if (contestNoticeId) {
      const condtion = [where("contestNoticeId", "==", contestNoticeId)];
      const returnContest = await fetchQuery.getDocuments("contests", condtion);
      const returnNotice = await fetchDocument.getDocument(contestNoticeId);

      if (returnContest[0].id && returnNotice.id) {
        setCurrentContest({
          ...currentContest,
          contestInfo: { ...returnNotice },
          contests: { ...returnContest[0] },
        });
      }
    }
  };

  useEffect(() => {
    console.log(contestList);
  }, [contestList]);

  useEffect(() => {
    fetchContest();
  }, [contestNoticeId]);

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="flex w-full h-full justify-start items-center bg-white">
      <div className="flex w-full h-full  ">
        <div className="flex w-full h-full items-center">
          <button
            onClick={() => handleDrawer()}
            className="flex w-10 h-10 justify-center items-center"
          >
            <RxHamburgerMenu className="text-2xl" />
          </button>
          <div className="flex justify-start items-center h-8 px-2 gap-x-1 overflow-hidden">
            <span className="text-sm text-gray-500">
              <BsTrophyFill />
            </span>
            <select
              className=" bg-transparent text-xs"
              onClick={(e) => setContestNoticeId(e.target.value)}
            >
              {contestList.length > 0 &&
                contestList.map((list, lIdx) => (
                  <option value={list.id}>{list.contestTitle}</option>
                ))}
            </select>
          </div>
        </div>
        <Drawer
          open={isOpenDrawer}
          onClose={handleDrawer}
          direction="left"
          size={300}
        >
          <Drawbar setOpen={handleDrawer} />
        </Drawer>
      </div>

      <div className="hidden  justify-between w-full">
        <div className="flex w-auto">
          <button className="w-auto h-full px-5 py-2">
            <span className="font-sans text-gray-500 font-semibold font-sm">
              BDBDg협회시스템
            </span>
          </button>
        </div>
        <div className="flex justify-end items-center w-auto px-5">
          <div className="flex justify-start items-center border border-t-0 border-b-0 border-l-gray-500 border-r-gray-500 h-8 px-5 gap-x-2">
            <span className="text-sm text-gray-500">
              <BsTrophyFill />
            </span>
            <select
              className=" bg-transparent"
              onClick={(e) => setContestNoticeId(e.target.value)}
            >
              {contestList.length > 0 &&
                contestList.map((list, lIdx) => (
                  <option value={list.id}>{list.contestTitle}</option>
                ))}
            </select>
          </div>
          <div className="flex justify-start items-center border border-t-0 border-b-0  border-r-gray-500 h-8 px-5 gap-x-2">
            <span className="text-sm text-gray-500">
              <BsInfoSquareFill />
            </span>
            <span>수동모드</span>
          </div>
          <div className="flex justify-start items-center h-8 px-5 gap-x-2">
            <span className="text-sm text-gray-500">
              <MdLogout />
            </span>
            <span>로그아웃</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
