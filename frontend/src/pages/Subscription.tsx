import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import type { SubscriptionType } from "../../../api/types";
import { AuthenticationContext } from "../components/authentication/AuthenticationProvider";
import ChipList from "../components/ChipList/ChipList";
import ClockComponent from "../components/Clock/ClockComponent";
import Description from "../components/Description/Description";
import QuestionList from "../components/QuestionList/QuestionList";
import type { ExamType } from "../components/QuestionList/types";
import { SocketIoContext } from "../components/socketio/SocketIoContext";
import SpeedDialMenu from "../components/SpeedDialMenu/SpeedDialMenu";
import UserInfoComponent from "../components/UserInfo/UserInfoComponent";
import { chips } from "../mocks/chips";

export const Subscription = () => {
  const { subcriptionId } = useParams();
  const [exam, setExam] = useState<ExamType | null>(null);
  const { username } = useContext(AuthenticationContext);
  const socketContext = useContext(SocketIoContext);
  const socket = socketContext.socket;

  console.log("ID SOTTOSCRIZIONE:", subcriptionId);

  useEffect(() => {
    socket?.emit('currentSubscription', subcriptionId);
    socket?.on("connect", () => {
      socket?.emit('currentSubscription', subcriptionId);
    });

    return () => {
      socket?.off("connect");
    };
  }, [socket, subcriptionId]);

  useEffect(() => {
    // Chiamiamo l'API per ottenere i dettagli della sottoscrizione
    fetch(`http://localhost:3000/api/subscriptions/${subcriptionId}`)
      .then((response) => response.json())
      .then((data: SubscriptionType) => {
        const examId = data.exam_id;
        return fetch(`http://localhost:3000/api/exams/${examId}`)
      })
      .then((response) => response.json())
      .then((examData: ExamType) => {
        console.log("Exam Data:", examData);
        setExam(examData);
      })
      .catch((error) => {
        console.error("Errore nel fetch della sottoscrizione:", error);
      });

  }, [subcriptionId]);

  return (
    <>
      <UserInfoComponent testo={username}></UserInfoComponent>
      <Description classe="1A" tipoDiTest="Matematica"></Description>
      <ChipList chips={chips}></ChipList>
      <ClockComponent tempo={7200}></ClockComponent>
      <QuestionList questionsList={exam?.questions || []} />
      <SpeedDialMenu />
    </>
  );
};
