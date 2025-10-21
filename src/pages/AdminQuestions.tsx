import { useEffect, useState } from "react";
import { QuestionsTab } from "@/components/QuestionsTab";
import { Question } from "@/types";
import { backendQuestionsApi } from "@/services/backendApi";

const AdminQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await backendQuestionsApi.getAllQuestions();
        console.log("Backend Questions API Response:", data);
        console.log("Data type:", typeof data);
        console.log("Is array:", Array.isArray(data));
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          console.error("Backend API returned non-array data:", data);
          setQuestions([]);
        }
      } catch (error) {
        console.error("Error loading questions from backend:", error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleUpdateQuestion = async (questionId: string, updatedQuestion: Partial<Question>) => {
    try {
      // Call the API to update the question (filtering is handled in the API layer)
      await backendQuestionsApi.updateQuestion(questionId, updatedQuestion);
      
      // Update the local state with the form data
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.id === questionId ? { ...question, ...updatedQuestion } : question
        )
      );
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleDeleteQuestion = async (questionId: string): Promise<void> => {
    try {
      await backendQuestionsApi.deleteQuestion(questionId);
      setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== questionId));
    } catch (error) {
      console.error("Error deleting question:", error);
      // Re-throw to let the component handle the error
      throw error;
    }
  };

  const handleAddQuestion = async (newQuestion: {
    question_text: string;
    question_description: string;
    question_placeholder: string;
  }): Promise<void> => {
    try {
      const createdQuestion = await backendQuestionsApi.createQuestion(newQuestion);
      setQuestions((prevQuestions) => [...prevQuestions, createdQuestion]);
    } catch (error) {
      console.error("Error adding question:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

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


