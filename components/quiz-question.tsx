"use client";

import { cn } from "@/lib/utils";
import { useCompletion } from "ai/react";
import { useMemo, useState } from "react";

export default function QuizQuestion({
  question,
}: {
  question: {
    question: string;
    type: string;
    choices: string[];
    answer: string;
  };
}) {
  // use completion
  const { completion, input, stop, isLoading, handleInputChange, complete } =
    useCompletion({
      api: "/api/completion",
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Evaluating the answer to the question");
    await complete(
      `Evaluate the answer to the ${question.question}.|| The correct answer is ${question.answer}. Compare the correct answer to my answer. || My answer is: ${input} for the question type ${question.type}. After giving me your analysis, append the value %CORRECT% if the answer is correct, %INCORRECT% if the answer is incorrect, and %PARTIALLY_CORRECT% if the answer is partially correct. Place these values at the end of the completion. If you dont have the relevant information to respond to the answer, (ie. the topic is out of your realm of knowledge) you can append %UNSURE% to the completion.`
    );
  };

  console.log(question);

  return (
    <div>
      <h2>{question.question}</h2>
      <form onSubmit={handleSubmit}>
        {question.type === "multiple-choice" ? (
          <ul>
            {question.choices.map((choice, index) => {
              return (
                <div className="form-control" key={index}>
                  <label className="label cursor-pointer">
                    <span className="label-text">
                      {String.fromCharCode(65 + index)}. {choice}
                    </span>
                    <input
                      type="radio"
                      name="radio-10"
                      className="radio"
                      checked={input === choice}
                      onClick={() => {
                        handleInputChange({
                          //@ts-ignore
                          target: {
                            value: choice,
                          },
                        });
                      }}
                    />
                  </label>
                </div>
              );
            })}
          </ul>
        ) : (
          <textarea
            value={input}
            onChange={handleInputChange}
            className="textarea w-full"
            placeholder="Answer here..."
          />
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={isLoading || !input}
          >
            Submit
          </button>
        </div>
      </form>

      {completion && (
        <div>
          <h3>Answer</h3>
          <AIAnswer answer={completion} />
        </div>
      )}
    </div>
  );
}

function AIAnswer({ answer }: { answer: string }) {
  const correctness = useMemo(() => {
    if (answer.includes("%CORRECT%")) {
      return "Correct";
    } else if (answer.includes("%INCORRECT%")) {
      return "Incorrect";
    } else if (answer.includes("%PARTIALLY_CORRECT%")) {
      return "Partially Correct";
    } else if (answer.includes("%UNSURE%")) {
      return "Unsure";
    } else {
      return "Computing...";
    }
  }, [answer]);

  // remove the correctness from the answer
  const answerWithoutCorrectness = useMemo(() => {
    return answer
      .replace("%CORRECT%", "")
      .replace("%INCORRECT%", "")
      .replace("%PARTIALLY_CORRECT%", "")
      .replace("%UNSURE%", "");
  }, [answer]);

  return (
    <div
      className={cn(
        "border-2 px-2 rounded-md ",
        correctness === "Correct" ? "border-green-500" : "",
        correctness === "Incorrect" ? "border-red-500" : "",
        correctness === "Unsure" ? "border-gray-500" : "",
        correctness === "Partially Correct" ? "border-yellow-500" : ""
      )}
    >
      <p
        className={cn(
          "font-bold",
          correctness === "Correct" ? "text-green-500" : "",
          correctness === "Incorrect" ? "text-red-500" : "",
          correctness === "Unsure" ? "text-gray-500" : "",
          correctness === "Partially Correct" ? "text-yellow-500" : ""
        )}
      >
        {correctness}
      </p>
      <p>{answerWithoutCorrectness}</p>
    </div>
  );
}
