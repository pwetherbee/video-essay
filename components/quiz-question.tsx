"use client";

import { useCompletion } from "ai/react";
import { useState } from "react";

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
      `Evaluate the answer to the ${question.question}. The correct answer is ${question.answer} User's answer: ${input}.`
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
          <p>{completion}</p>
        </div>
      )}
    </div>
  );
}
