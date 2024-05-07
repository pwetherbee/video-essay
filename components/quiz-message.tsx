"use client";

import { Message } from "ai";
import { useEffect, useMemo, useState } from "react";
import QuizQuestion from "./quiz-question";
import { clear } from "console";

export default function QuizMessage({
  message,
  isLoading,
}: {
  message: Message;
  isLoading: boolean;
}) {
  const quiz = useMemo(() => {
    return parseQuizMessage(message);
  }, [message]);

  if (quiz.error && !isLoading) {
    return (
      <div>
        <h1 className="text-xl">Unable to load quiz. Please try again.</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-col">
        <h1 className="text-xl">Loading quiz...</h1>
        <span className="loading loading-dots" />
      </div>
    );
  }
  return (
    <div>
      <article className="prose">
        <h1>{quiz.title}</h1>
        {quiz.questions.map(
          (
            question: {
              question: string;
              type: string;
              choices: string[];
              answer: string;
            },
            index: number
          ) => {
            return <QuizQuestion key={index} question={question} />;
          }
        )}
      </article>
    </div>
  );
}

function parseQuizMessage(message: Message) {
  /*%QUIZ% { "title": "Quiz on Flat Earth Theory", "questions": [ { "type": "multiple-choice", "question": "According to the video, why would living on a flat disk-shaped Earth feel normal in the middle but different towards the edge?", "choices": [ "Due to the lack of gravity", "Because of the curvature of the disk", "Gravity would slightly skew, pushing back towards the center", "The Earth would be perfectly flat" ], "answer": "Gravity would slightly skew, pushing back towards the center" }, { "type": "text", "question": "Explain the historical misconception regarding the belief that the Earth was flat and how it originated.", "answer": "The misconception that many people believed the Earth was flat likely began as a modern era insult, despite scholars and major religions in the West accepting Earth's rotundity since ancient times. The smear was repeated and published until it became accepted as historical fact." }, { "type": "multiple-choice", "question": "How did Eratosthenes determine the circumference of the Earth in ancient times?", "choices": [ "By measuring the length of a shadow in Greece", "By observing the stars at night", "By analyzing boat travel distances", "By comparing shadows cast by poles in Syene and Alexandria" ], "answer": "By comparing shadows cast by poles in Syene and Alexandria" } ] }
   */

  // convert the message content to a JSON object
  try {
    const quiz = message.content.replace("%QUIZ%", "");
    return JSON.parse(quiz);
  } catch (error) {
    console.error("Error parsing quiz message:", error);
    // if the message content is not a valid JSON object, return a default quiz
    return {
      error: true,
      questions: [],
    };
  }
}
