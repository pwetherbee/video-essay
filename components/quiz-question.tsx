"use client";

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
      `Evaluate the answer to the ${question.question}|| The correct answer is ${question.answer}. || My answer: ${input}. After explaining your analysis, append the value %CORRECT% if the answer is correct, and %INCORRECT% if the answer is incorrect. Or %PARTIALLY_CORRECT% if the answer is partially correct. Place these values at the end of the completion.`
    );
  };

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
    } else {
      return "Unknown";
    }
  }, [answer]);

  // remove the correctness from the answer
  const answerWithoutCorrectness = useMemo(() => {
    return answer
      .replace("%CORRECT%", "")
      .replace("%INCORRECT%", "")
      .replace("%PARTIALLY_CORRECT%", "");
  }, [answer]);

  return (
    <div className="">
      <p>{answerWithoutCorrectness}</p>
    </div>
  );
}
