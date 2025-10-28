import type { QuestionType } from "../types";
import styles from "./QuestionComponent.module.css";

export type QuestionComponentProp = {
  question: QuestionType;
  response: string;
  setResponse: (value: string) => void;
  shake?: boolean;
};

const QuestionComponent = ({
  question,
  response,
  setResponse,
  shake = false,
}: QuestionComponentProp) => {
  return (
    <fieldset className={`${styles.form} ${shake ? styles.shake : ""}`}>
      <h3 className={styles.question}>{question.text} ? </h3>
      {question?.answers?.map((answer) => (
        <label key={answer._id}>
          <input
            type="radio"
            name={question._id}
            value={answer._id}
            className={styles.radio}
            checked={answer._id === response}
            onChange={() => {
              console.log("Domanda: ", question, "Hai selezionato: ", answer);
              setResponse(answer._id);
            }}
          />
          {answer.answer}
        </label>
      ))}
    </fieldset>
  );
};

export default QuestionComponent;
