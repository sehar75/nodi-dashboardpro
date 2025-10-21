import { useEffect, useState } from "react";
import { QuestionsTab } from "@/components/QuestionsTab";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Question } from "@/types";
import { backendQuestionsApi } from "@/services/backendApi";

const AdminQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backendQuestionsApi.getAllQuestions()
      .then(setQuestions)
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateQuestion = async (questionId: string, updatedQuestion: Partial<Question>) => {
    await backendQuestionsApi.updateQuestion(questionId, updatedQuestion);
    setQuestions(prevQuestions =>
      prevQuestions.map(q => q.id === questionId ? { ...q, ...updatedQuestion } : q)
    );
  };

  const handleDeleteQuestion = async (questionId: string): Promise<void> => {
    await backendQuestionsApi.deleteQuestion(questionId);
    setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionId));
  };

  const handleAddQuestion = async (newQuestion: {
    question_text: string;
    question_description: string;
    question_placeholder: string;
  }): Promise<void> => {
    const createdQuestion = await backendQuestionsApi.createQuestion(newQuestion);
    setQuestions(prevQuestions => [...prevQuestions, createdQuestion]);
  };

  if (loading) return <LoadingSpinner message="Loading questions..." />;

  return (
    <QuestionsTab
      questions={questions}
      onUpdateQuestion={handleUpdateQuestion}
      onDeleteQuestion={handleDeleteQuestion}
      onAddQuestion={handleAddQuestion}
    />
  );
};

export default AdminQuestions;


