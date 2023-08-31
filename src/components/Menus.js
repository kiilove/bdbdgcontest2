import {
  BsTrophyFill,
  BsPrinterFill,
  BsFillHandIndexThumbFill,
  BsCpuFill,
  BsCheckAll,
  BsInfoLg,
  BsListOl,
  BsCardChecklist,
} from "react-icons/bs";

import { AiOutlineGroup } from "react-icons/ai";
import { PiUsersFour } from "react-icons/pi";
import { CgUserList } from "react-icons/cg";
import { GiPodiumWinner } from "react-icons/gi";

import {
  TbCertificate,
  TbFileCertificate,
  TbHeartRateMonitor,
} from "react-icons/tb";
import { HiUserGroup, HiUsers } from "react-icons/hi";
import {
  MdTimeline,
  MdBalance,
  MdDoneAll,
  MdOutlineScale,
  MdOutlineTouchApp,
} from "react-icons/md";
import { BiAddToQueue, BiUserPlus } from "react-icons/bi";
import { BsClipboardData } from "react-icons/bs";
import { LiaClipboardListSolid } from "react-icons/lia";
export const MenuArray = [
  {
    id: 0,
    title: "대회관리",
    isActive: true,
    icon: <BsTrophyFill />,
    subMenus: [
      {
        id: 1,
        title: "새로운대회개설",
        icon: <BiAddToQueue />,
        link: "/newcontest",
        isActive: false,
      },
      {
        id: 2,
        title: "대회목록",
        icon: <LiaClipboardListSolid />,
        link: "/contestlist",
        isActive: true,
      },

      {
        id: 3,
        title: "참가신청서",
        icon: <PiUsersFour />,
        link: "/contestinvoicetable",
        isActive: true,
      },
      {
        id: 4,
        title: "참가신청서 수동작성",
        icon: <BiUserPlus />,
        link: "/contestnewinvoicemanual",
        isActive: true,
      },
      {
        id: 5,
        title: "기초데이터(1단계)",
        icon: <BsClipboardData />,
        link: "/contesttimetable",
        isActive: true,
      },
      {
        id: 6,
        title: "계측(2단계)",
        icon: <MdOutlineScale />,
        link: "/contestplayerordertable",
        isActive: true,
      },
      {
        id: 7,
        title: "최종명단(3단계)",
        icon: <CgUserList />,
        link: "/contestplayerordertableafter",
        isActive: true,
      },
      {
        id: 8,
        title: "무대설정(4단계)",
        icon: <AiOutlineGroup />,
        link: "/conteststagetable",
        isActive: true,
      },

      {
        id: 9,
        title: "심판선발",
        icon: <MdBalance />,
        link: "/contestjudgetable",
        isActive: true,
      },
      {
        id: 10,
        title: "그랑프리명단",
        icon: <GiPodiumWinner />,
        link: "/contestplayerordergrandprix",
        isActive: true,
      },
    ],
  },
  {
    id: 1,
    title: "출력관리",
    icon: <BsPrinterFill />,
    isActive: true,
    subMenus: [
      {
        id: 1,
        title: "계측명단 통합",
        icon: <MdOutlineScale />,
        link: "/printbase",
        isActive: true,
      },
      {
        id: 2,
        title: "계측명단 종목별",
        icon: <MdOutlineScale />,
        isActive: false,
      },
      {
        id: 3,
        title: "선수명단 통합",
        icon: <HiUserGroup />,
        isActive: true,
        link: "/printplayersfinal",
      },
      { id: 4, title: "선수명단 종목별", icon: <HiUsers />, isActive: false },
      { id: 5, title: "순위표 통합", icon: <BsListOl />, isActive: true },
      { id: 6, title: "순위표 종목별", icon: <BsListOl />, isActive: true },
      {
        id: 7,
        title: "집계표 출력",
        icon: <BsCardChecklist />,
        isActive: true,
      },
      {
        id: 8,
        title: "상장 출력",
        icon: <TbCertificate />,
        isActive: true,
        link: "/awardlist",
      },
      {
        id: 9,
        title: "상장부여현황",
        icon: <TbFileCertificate />,
        isActive: true,
      },
    ],
  },
  {
    id: 2,
    title: "수동모드",
    isActive: true,
    icon: <BsFillHandIndexThumbFill />,
    subMenus: [{ id: 1, title: "심사표 입력", icon: <MdOutlineTouchApp /> }],
  },
  {
    id: 3,
    title: "자동모드",
    isActive: true,
    icon: <BsCpuFill />,
    subMenus: [
      {
        id: 1,
        title: "모니터링 화면",
        isActive: true,
        icon: <TbHeartRateMonitor />,
        link: "/contestmonitoring",
      },
      {
        id: 2,
        title: "스크린",
        isActive: true,
        icon: <TbHeartRateMonitor />,
        link: "/screen1",
      },
    ],
  },
];
