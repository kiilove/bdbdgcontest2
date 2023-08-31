import React, { useState, useEffect, useContext } from "react";
import ReactPlayer from "react-player";
import AwardVideo from "../assets/mov/award.mp4";
import "../styles/style.scss";
import { useFirebaseRealtimeGetDocument } from "../hooks/useFirebaseRealtime";
import { debounce } from "lodash";
import { CurrentContestContext } from "../contexts/CurrentContestContext";
import ScreenPlayerIntro from "./ScreenPlayerIntro";
import ScreenScoreIntro from "./ScreenScoreIntro";

const StandingTableType1 = ({ contestId }) => {
  const { data: realtimeData, getDocument: currentStageFunction } =
    useFirebaseRealtimeGetDocument();

  const ranks = [
    "1.김진배 / 제이앤코어",
    "3.오종일 / 고궁비빔피트니스클럽",
    "2.홍길동 / 다뺀다짐",
    "Alice Kim",
    "Charlie Lee",
  ];

  const [scene, setScene] = useState(1); // 현재 씬 (1, 2, 3)
  const [displayedRank, setDisplayedRank] = useState(5); // 5위부터 시작

  useEffect(() => {
    const debouncedGetDocument = debounce(
      () => currentStageFunction(`currentStage/bovwlDjlv7aOdFfwj9Q4`),
      1000
    );
    debouncedGetDocument();

    return () => {};
  }, [currentStageFunction]);

  return (
    <div className="flex w-full h-full relative items-start justify-center overflow-hidden">
      {realtimeData && realtimeData.screen.status.playStart && (
        <ScreenPlayerIntro
          categoryTitle={realtimeData.categoryTitle}
          gradeTitle={realtimeData.screen.gradeTitle}
          rankOrder={realtimeData.screen.players}
        />
      )}
      {realtimeData && realtimeData.screen.status.standingStart && (
        <ScreenScoreIntro
          categoryTitle={realtimeData.categoryTitle}
          gradeTitle={realtimeData.screen.gradeTitle}
          rankOrder={realtimeData.screen.players}
        />
      )}
    </div>
  );
};

export default StandingTableType1;
