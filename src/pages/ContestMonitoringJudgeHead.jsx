import React from "react";
import { useState } from "react";
import _ from "lodash";
import LoadingPage from "./LoadingPage";
import { TbHeartRateMonitor } from "react-icons/tb";
import {
  useFirestoreGetDocument,
  useFirestoreQuery,
  useFirestoreUpdateData,
} from "../hooks/useFirestores";
import { useContext } from "react";
import { CurrentContestContext } from "../contexts/CurrentContestContext";
import { useEffect } from "react";
import {
  useFirebaseRealtimeAddData,
  useFirebaseRealtimeDeleteData,
  useFirebaseRealtimeGetDocument,
  useFirebaseRealtimeQuery,
  useFirebaseRealtimeUpdateData,
} from "../hooks/useFirebaseRealtime";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import ConfirmationModal from "../messageBox/ConfirmationModal";
import { where } from "firebase/firestore";
import { Modal } from "@mui/material";
import CompareSetting from "../modals/CompareSetting";
import ContestRankingSummary from "../modals/ContestRankingSummary";
import ContestPointSummary from "../modals/ContestPointSummary";

const ContestMonitoringJudgeHead = () => {
  const navigate = useNavigate();
  const { currentContest } = useContext(CurrentContestContext);
  const [compareMode, setCompareMode] = useState({
    isCompare: false,
    compareStart: false,
    compareEnd: false,
    compareCancel: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isHolding, setIsHolding] = useState(false);
  const [contestInfo, setContestInfo] = useState({});

  const [parentRefresh, setParentRefresh] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [compareCancelMsgOpen, setCompareCancelMsgOpen] = useState(false);
  const [rankingSummaryOpen, setRankingSummaryOpen] = useState(false);
  const [rankingSummaryProp, setRankingSummaryProp] = useState({});
  const [pointSummaryOpen, setPointSummaryOpen] = useState(false);
  const [pointSummaryProp, setPointSummaryProp] = useState({});
  const [message, setMessage] = useState({});

  const [compareOpen, setCompareOpen] = useState(false);
  const [compareInfo, setCompareInfo] = useState({
    playerLength: undefined,
    scoreMode: undefined,
  });
  const [stagesArray, setStagesArray] = useState([]);
  const [playersArray, setPlayersArray] = useState([]);
  const [comparesList, setComparesList] = useState({});
  const [comparesArray, setComparesArray] = useState([]);
  const [currentCompareInfo, setCurrentCompareInfo] = useState({});
  const [matchedOriginalPlayers, setMatchedOriginalPlayers] = useState([]);
  const [currentStageInfo, setCurrentStageInfo] = useState({ stageId: null });
  const [realtimeData, setrealtimeData] = useState({});
  const [compareStatus, setCompareStatus] = useState({
    compareStart: false,
    compareEnd: false,
    compareCancel: false,
    compareIng: false,
  });
  const [normalScoreData, setNormalScoreData] = useState([]);
  const [normalScoreTable, setNormalScoreTable] = useState([]);

  const [currentScoreTableByJudge, setCurrentScoreTableByJudge] = useState([]);

  const fetchNotice = useFirestoreGetDocument("contest_notice");
  const fetchStages = useFirestoreGetDocument("contest_stages_assign");
  const fetchFinalPlayers = useFirestoreGetDocument("contest_players_final");
  const fetchCompares = useFirestoreGetDocument("contest_compares_list");
  const updateCompare = useFirestoreUpdateData("contest_compares_list");
  const fetchScoreCardQuery = useFirestoreQuery();

  const { data: fetchRealTimeCurrentStage, getDocument: currentStageFunction } =
    useFirebaseRealtimeGetDocument();

  const addCurrentStage = useFirebaseRealtimeAddData();
  const updateRealtimeCompare = useFirebaseRealtimeUpdateData();

  const fetchPool = async (
    noticeId,
    stageAssignId,
    playerFinalId,
    compareListId
  ) => {
    try {
      const returnNotice = await fetchNotice.getDocument(noticeId);
      const returnContestStage = await fetchStages.getDocument(stageAssignId);
      const returnPlayersFinal = await fetchFinalPlayers.getDocument(
        playerFinalId
      );
      const returnCompareList = await fetchCompares.getDocument(compareListId);

      if (returnNotice && returnContestStage) {
        const promises = [
          setStagesArray(
            returnContestStage.stages.sort(
              (a, b) => a.stageNumber - b.stageNumber
            )
          ),
          setContestInfo({ ...returnNotice }),
          setPlayersArray(
            returnPlayersFinal.players
              .sort((a, b) => a.playerIndex - b.playerIndex)
              .filter((f) => f.playerNoShow === false)
          ),
        ];

        Promise.all(promises);

        setIsLoading(false);
      }

      if (returnCompareList) {
        setComparesList({ ...returnCompareList });
        setComparesArray([...returnCompareList.compares]);

        if (returnCompareList?.compares?.length === 0) {
          setCurrentCompareInfo({});
        }
        if (returnCompareList.compares.length > 0) {
          console.log(
            returnCompareList.compares[returnCompareList.compares.length - 1]
          );
          setCurrentCompareInfo({
            ...returnCompareList.compares[
              returnCompareList.compares.length - 1
            ],
          });
        }
      }
    } catch (error) {
      setMessage({
        body: "데이터를 로드하지 못했습니다.",
        body4: error.message,
        isButton: true,
        confirmButtonText: "확인",
      });
    }
  };

  const fetchScoreTable = async (grades) => {
    setIsLoading(true);
    const allData = [];

    for (let grade of grades) {
      const { gradeId } = grade;
      try {
        const condition = [where("gradeId", "==", gradeId)];
        const data = await fetchScoreCardQuery.getDocuments(
          contestInfo.contestCollectionName,
          condition
        );
        allData.push(...data);
      } catch (error) {
        console.log(error);
      }
    }

    setNormalScoreData(allData);
    setIsLoading(false);
  };

  const handleJudgeIsLoginedValidated = (judgesArray) => {
    if (judgesArray?.length <= 0) {
      return;
    }
    // console.log(judgesArray);
    const validate = judgesArray.some((s) => s.isLogined === false);
    //console.log(validate);
    return validate;
  };
  const handleForceScoreTableRefresh = (grades) => {
    console.log(grades);
    if (grades?.length <= 0) {
      return;
    }

    fetchScoreTable(grades);
  };

  const handleScoreTableByJudge = (grades) => {
    if (!_.isEqual(realtimeData?.judges, fetchRealTimeCurrentStage?.judges)) {
      fetchScoreTable(grades);
    }
  };

  const handleGradeInfo = (grades) => {
    let gradeTitle = "";
    let gradeId = "";

    if (grades?.length === 0) {
      gradeTitle = "오류발생";
      gradeId = "";
    }
    if (grades.length === 1) {
      gradeTitle = grades[0].gradeTitle;
      gradeId = grades[0].gradeId;
    } else if (grades.length > 1) {
      const madeTitle = grades.map((grade, gIdx) => {
        return grade.gradeTitle + " ";
      });
      gradeId = grades[0].gradeId;
      gradeTitle = madeTitle + "통합";
    }

    return { gradeTitle, gradeId };
  };

  const handleAddCurrentStage = async () => {
    const {
      stageId,
      stageNumber,
      categoryJudgeCount,
      categoryId,
      categoryTitle,
      grades,
    } = stagesArray[0];

    const gradeTitle = handleGradeInfo(grades).gradeTitle;
    const gradeId = handleGradeInfo(grades).gradeId;

    const judgeInitState = Array.from(
      { length: categoryJudgeCount },
      (_, jIdx) => jIdx + 1
    ).map((number) => {
      return { seatIndex: number, isLogined: false, isEnd: false };
    });

    const newCurrentStateInfo = {
      stageId,
      stageNumber,
      categoryId,
      categoryTitle,
      gradeId,
      gradeTitle,
      stageJudgeCount: categoryJudgeCount,
      judges: judgeInitState,
    };
    try {
      await addCurrentStage
        .addData(
          "currentStage",
          newCurrentStateInfo,
          currentContest.contests.id
        )
        .then((data) => setrealtimeData({ ...data }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleGotoSummary = (categoryId, categoryTitle, grades) => {
    navigate("/contestranksummary", {
      state: { categoryId, categoryTitle, grades },
    });
  };

  const handleCompareCancel = async (contestId, compareIndex) => {
    const collectionInfoByCompares = `currentStage/${contestId}/compares`;
    const newCompareArray = [...comparesArray];
    newCompareArray.splice(compareIndex, 1);
    let newRealtimeInfo = {
      status: {
        compareStart: false,
        compareEnd: false,
        compareCancel: false,
        compareIng: false,
      },
    };
    let newRealtimePlayers = [];

    if (compareIndex > 0) {
      newRealtimeInfo = {
        compareIndex: comparesArray[compareIndex - 1].compareIndex,
        status: {
          compareStart: false,
          compareEnd: false,
          compareCancel: false,
          compareIng: true,
        },
        playerLength: comparesArray[compareIndex - 1].comparePlayerLength,
        scoreMode: comparesArray[compareIndex - 1].compareScoreMode,
        players: [...comparesArray[compareIndex - 1].players],
      };
    }

    try {
      await updateRealtimeCompare
        .updateData(collectionInfoByCompares, {
          ...newRealtimeInfo,
        })
        .then((data) => console.log(data))
        .then(() =>
          setCompareStatus(() => ({
            compareStart: false,
            compareEnd: false,
            compareCancel: true,
            compareIng: false,
          }))
        )
        .then(async () => {
          await updateCompare.updateData(comparesList.id, {
            ...comparesList,
            compares: [...newCompareArray],
          });
        })
        .then(() => {
          setComparesList(() => ({
            ...comparesList,
            compares: [...newCompareArray],
          }));
          setComparesArray(() => [...newCompareArray]);
        })
        .then(() => setParentRefresh(true))
        .then(() => setCompareCancelMsgOpen(false));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      currentContest?.contests?.contestNoticeId &&
      currentContest?.contests?.contestStagesAssignId &&
      currentContest?.contests?.contestPlayersFinalId &&
      currentContest?.contests?.contestComparesListId
    ) {
      fetchPool(
        currentContest.contests.contestNoticeId,
        currentContest.contests.contestStagesAssignId,
        currentContest?.contests?.contestPlayersFinalId,
        currentContest?.contests?.contestComparesListId
      );
    }
  }, [currentContest]);

  useEffect(() => {
    if (parentRefresh) {
      setIsLoading(true);
      fetchPool(
        currentContest.contests.contestNoticeId,
        currentContest.contests.contestStagesAssignId,
        currentContest?.contests?.contestPlayersFinalId,
        currentContest?.contests?.contestComparesListId
      );
      setParentRefresh(false);
    }
  }, [parentRefresh]);

  useEffect(() => {
    setrealtimeData(fetchRealTimeCurrentStage);
    setCurrentStageInfo({
      ...stagesArray.find(
        (f) => f.stageId === fetchRealTimeCurrentStage?.stageId
      ),
    });
  }, [fetchRealTimeCurrentStage]);

  useEffect(() => {
    if (!isHolding && currentContest?.contests?.id) {
      const debouncedGetDocument = debounce(
        () =>
          currentStageFunction(`currentStage/${currentContest.contests.id}`),
        2000
      );
      debouncedGetDocument();
    }

    return () => {};
  }, [currentStageFunction]);

  useEffect(() => {
    if (fetchRealTimeCurrentStage?.judgex) {
      setrealtimeData(() => ({ ...fetchRealTimeCurrentStage }));
    }

    if (
      fetchRealTimeCurrentStage?.stageJudgeCount &&
      currentStageInfo?.grades?.length > 0 &&
      playersArray?.length > 0
    ) {
      handleScoreTableByJudge(currentStageInfo.grades);
      setMatchedOriginalPlayers(
        playersArray
          .filter(
            (f) => f.contestGradeId === currentStageInfo.grades[0].gradeId
          )
          .sort((a, b) => a.playerIndex - b.playerIndex)
      );
    }
  }, [
    fetchRealTimeCurrentStage?.stageJudgeCount,
    fetchRealTimeCurrentStage?.judges,
    playersArray,
    currentStageInfo,
  ]);

  useEffect(() => {
    if (compareMode.compareStart) {
      setCompareOpen(true);
    }
  }, [compareMode]);

  useEffect(() => {
    if (
      compareInfo.playerLength !== undefined &&
      compareInfo.scoreMode !== undefined
    ) {
      setCompareMode(() => ({
        compareIng: true,
        compareStart: true,
        compareEnd: false,
        compareCancel: false,
      }));
    }
  }, [compareInfo]);

  return (
    <>
      {isLoading && (
        <div className="flex w-full h-screen justify-center items-center">
          <LoadingPage propStyles={{ width: "80", height: "60" }} />
        </div>
      )}
      {!isLoading && (
        <div className="flex flex-col w-full h-full bg-white rounded-lg p-3 gap-y-2 justify-start items-start">
          <ConfirmationModal
            isOpen={msgOpen}
            message={message}
            onCancel={() => setMsgOpen(false)}
            onConfirm={() => setMsgOpen(false)}
          />
          <ConfirmationModal
            isOpen={compareCancelMsgOpen}
            message={message}
            onCancel={() => setCompareCancelMsgOpen(false)}
            onConfirm={() =>
              handleCompareCancel(
                currentContest.contests.id,
                comparesArray?.length - 1
              )
            }
          />
          <Modal open={compareOpen} onClose={() => setCompareOpen(false)}>
            <CompareSetting
              stageInfo={currentStageInfo}
              setClose={setCompareOpen}
              matchedOriginalPlayers={matchedOriginalPlayers}
              setRefresh={setParentRefresh}
              propCompareIndex={comparesArray?.length + 1}
            />
          </Modal>
          <Modal open={rankingSummaryOpen}>
            <ContestRankingSummary
              categoryId={rankingSummaryProp?.categoryId}
              gradeId={rankingSummaryProp?.gradeId}
              stageId={realtimeData?.stageId}
              setClose={setRankingSummaryOpen}
            />
          </Modal>
          <Modal open={pointSummaryOpen}>
            <ContestPointSummary
              categoryId={pointSummaryProp?.categoryId}
              gradeId={pointSummaryProp?.gradeId}
              stageId={realtimeData?.stageId}
              setClose={setPointSummaryOpen}
            />
          </Modal>
          <div className="flex w-full h-auto">
            <div className="flex w-full bg-gray-100 justify-start items-center rounded-lg p-3">
              <div className="flex w-4/5 px-2 flex-col gap-y-2">
                <h1 className="font-sans text-base font-semibold">
                  대회명 : {contestInfo.contestTitle}
                </h1>
                <h1 className="font-sans text-base font-semibold">
                  모니터링상태 :{" "}
                  {realtimeData?.stageId && !isHolding && "실시간모니터링중"}
                  {realtimeData?.stageId && isHolding && "모니터링 일시정지"}
                  {!realtimeData?.stageId && !isHolding && "대회시작전"}
                </h1>
              </div>
              <div className="flex w-1/5 h-full">
                {realtimeData?.stageId && !isHolding && (
                  <button
                    className="bg-gray-400 w-full h-full text-white text-lg rounded-lg"
                    onClick={() => setIsHolding(true)}
                  >
                    일시정지
                  </button>
                )}
                {realtimeData?.stageId && isHolding && (
                  <button
                    className="bg-blue-600 w-full h-full text-white text-lg rounded-lg"
                    onClick={() => setIsHolding(false)}
                  >
                    모니터링 시작
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full h-auto">
            <div className="flex w-full h-auto justify-start items-center bg-blue-100 rounded-lg rounded-b-lg p-2">
              <div className="flex w-full h-auto gap-y-2 flex-col">
                {realtimeData && (
                  <div
                    className="flex bg-gray-100 p-2 w-full h-auto rounded-lg flex-col justify-start items-center"
                    style={{ minHeight: "70px" }}
                  >
                    {/* {!handleJudgeIsLoginedValidated(realtimeData.judges) &&
                      comparesArray && (
                        <div className="flex w-full h-auto justify-center items-center">
                          <button
                            className="bg-blue-400 w-full h-full p-2 rounded-lg text-gray-100 text-lg font-semibold"
                            style={{ minHeight: "50px" }}
                            onClick={() =>
                              setCompareMode(() => ({
                                ...compareMode,
                                compareStart: true,
                              }))
                            }
                          >
                            {comparesArray.length + 1}차 비교심사시작
                          </button>
                        </div>
                      )} */}
                    {realtimeData.judges && comparesArray && (
                      <div className="flex w-full h-auto justify-center items-center">
                        <button
                          className="bg-blue-400 w-full h-full p-2 rounded-lg text-gray-100 text-lg font-semibold"
                          style={{ minHeight: "50px" }}
                          onClick={() =>
                            setCompareMode(() => ({
                              ...compareMode,
                              compareStart: true,
                            }))
                          }
                        >
                          {comparesArray.length + 1}차 비교심사시작
                        </button>
                      </div>
                    )}
                    {currentCompareInfo?.players?.length > 0 && (
                      <div className="flex w-full h-auto justify-start items-start border flex-col">
                        <div className="flex w-full justify-start items-center h-auto p-2">
                          <div className="flex w-1/3 justify-center items-center h-10  border border-gray-400">
                            {currentCompareInfo?.compareIndex}차 비교심사
                          </div>
                          <div className="flex w-1/3 justify-center items-center h-10 border border-gray-400 border-l-0">
                            <div className="flex w-full justify-center items-center">
                              <span className="mx-2">선발인원 : </span>
                              <span>
                                {currentCompareInfo?.comparePlayerLength}
                              </span>
                            </div>
                          </div>
                          <div className="flex w-1/3 justify-center items-center h-10 border border-gray-400 border-l-0">
                            <div className="flex w-full justify-center items-center">
                              <span className="mx-2">채점모드 : </span>
                              <span>
                                {currentCompareInfo?.compareScoreMode ===
                                "compare"
                                  ? "대상자만 채점"
                                  : "전체 채점"}
                              </span>
                            </div>
                          </div>
                        </div>
                        {comparesArray?.length > 0 &&
                          comparesArray.map((compare, cIdx) => {
                            const { players, compareIndex } = compare;

                            return (
                              <div className="flex w-full justify-start items-center h-auto p-2">
                                <div className="flex w-2/3 justify-start items-center gap-x-2 p-2 border border-gray-400 rounded-lg">
                                  {players?.map((top, tIdx) => (
                                    <div className="flex w-10 h-10 rounded-lg bg-blue-500 justify-center items-center font-semibold border-2 border-blue-800 flex-col text-xl text-gray-100">
                                      {top.playerNumber}
                                    </div>
                                  ))}
                                </div>
                                {compareIndex >= comparesArray?.length && (
                                  <div className="flex w-1/3 justify-end items-center gap-x-2">
                                    <button
                                      className="h-10 w-auto py-2 px-5 bg-red-500 text-gray-100 rounded-lg"
                                      onClick={() => {
                                        setMessage({
                                          body: "비교심사를 취소하시겠습니까?",
                                          isButton: true,
                                          cancelButtonText: "아니오",
                                          confirmButtonText: "예",
                                        });
                                        setCompareCancelMsgOpen(true);
                                      }}
                                    >
                                      {compareIndex}차 비교심사 취소
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}

                        <div className="flex w-full justify-start items-center h-auto p-2"></div>
                      </div>
                    )}
                  </div>
                )}

                {realtimeData && (
                  <div className="flex w-full flex-col h-auto gap-y-2">
                    <div className="flex bg-white p-2 w-full h-auto rounded-lg flex-col justify-center items-start">
                      <div className="flex w-full h-14 justify-start items-center px-2">
                        <div className="flex w-2/3 justify-start items-center h-auto">
                          <span className="font-bold text-lg">집계상황</span>
                          <button
                            className="ml-2 w-20 h-auto p-2 bg-blue-200 rounded-lg"
                            onClick={() =>
                              handleForceScoreTableRefresh(
                                currentStageInfo.grades
                              )
                            }
                          >
                            새로고침
                          </button>
                        </div>
                      </div>

                      {currentStageInfo?.grades?.length > 0 &&
                        currentStageInfo.grades.map((grade, gIdx) => {
                          const {
                            categoryTitle,
                            categoryId,
                            gradeTitle,
                            gradeId,
                          } = grade;

                          const { categoryJudgeType } = currentStageInfo;

                          const filterdPlayers = playersArray
                            .filter(
                              (f) =>
                                f.contestGradeId === gradeId &&
                                f.playerNoShow === false
                            )
                            .sort((a, b) => a.playerIndex - b.playerIndex);
                          return (
                            <div className="flex w-full h-auto p-2 flex-col">
                              <div className="flex w-full h-20 justify-start items-center gap-x-2">
                                <span>
                                  {categoryTitle}({gradeTitle})
                                </span>
                                <div className="flex">
                                  {categoryJudgeType === "point" ? (
                                    <button
                                      className="w-auto h-10  text-gray-100 bg-blue-800 rounded-lg px-5 py-2"
                                      onClick={() => {
                                        setPointSummaryProp({
                                          categoryId,
                                          gradeId,
                                          categoryJudgeType,
                                        });
                                        setPointSummaryOpen(true);
                                      }}
                                    >
                                      점수형 집계및 순위확인
                                    </button>
                                  ) : (
                                    <button
                                      className="w-auto h-10  text-gray-100 bg-blue-800 rounded-lg px-5 py-2"
                                      onClick={() => {
                                        setRankingSummaryProp({
                                          categoryId,
                                          gradeId,
                                          categoryJudgeType,
                                        });
                                        setRankingSummaryOpen(true);
                                      }}
                                    >
                                      랭킹형 집계및 순위확인
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="flex w-full h-10 justify-start items-center">
                                <div
                                  className="h-full p-2 justify-center items-start flex w-full border border-gray-400 border-b-2"
                                  style={{ maxWidth: "15%" }}
                                >
                                  구분
                                </div>
                                {realtimeData?.judges &&
                                  realtimeData.judges.map((judge, jIdx) => {
                                    const { seatIndex } = judge;
                                    return (
                                      <div
                                        className="h-full p-2 justify-center items-start flex w-full border-t border-b-2 border-r border-gray-400 "
                                        style={{ maxWidth: "15%" }}
                                      >
                                        {seatIndex}
                                      </div>
                                    );
                                  })}
                              </div>
                              {filterdPlayers.map((player, pIdx) => {
                                const { playerNumber } = player;

                                return (
                                  <div className="flex">
                                    <div
                                      className="h-full p-2 justify-center items-start flex w-full border-l border-b border-r  border-gray-400 "
                                      style={{ maxWidth: "15%" }}
                                    >
                                      {playerNumber}
                                    </div>
                                    {realtimeData?.judges?.length > 0 &&
                                      realtimeData?.judges.map(
                                        (judge, jIdx) => {
                                          const { seatIndex } = judge;

                                          const finded = normalScoreData.find(
                                            (f) =>
                                              f.playerNumber === playerNumber &&
                                              f.seatIndex === seatIndex
                                          );

                                          return (
                                            <div
                                              className="h-auto p-2 justify-center items-start flex w-full  border-r border-b border-gray-400 "
                                              style={{ maxWidth: "15%" }}
                                            >
                                              {finded?.playerScore !== 0 &&
                                              finded?.playerScore !==
                                                undefined &&
                                              finded?.playerScore !== 1000
                                                ? finded.playerScore
                                                : ""}
                                              {finded?.playerScore === 1000 &&
                                                "순위제외"}
                                            </div>
                                          );
                                        }
                                      )}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContestMonitoringJudgeHead;
