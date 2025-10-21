import { useState } from "react";
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { EditQuestionDialog } from "./EditQuestionDialog";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { toast } from "@/hooks/use-toast";
import { backendQuestionsApi } from "@/services/backendApi";

interface QuestionsTabProps {
  questions: Question[];
  onUpdateQuestion: (questionId: string, updatedQuestion: Partial<Question>) => void;
  onDeleteQuestion: (questionId: string) => Promise<void>;
  onAddQuestion?: (newQuestion: {
    question_text: string;
    question_description: string;
    question_placeholder: string;
  }) => Promise<void>;
}

export const QuestionsTab = ({
  questions,
  onUpdateQuestion,
  onDeleteQuestion,
  onAddQuestion,
}: QuestionsTabProps) => {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Safety check to ensure questions is an array
  const safeQuestions = Array.isArray(questions) ? questions : [];

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
  };

  const handleSaveEdit = async (updatedQuestion: Partial<Question>) => {
    if (editingQuestion) {
      try {
        // Call the API to update the question (filtering is handled in the API layer)
        await backendQuestionsApi.updateQuestion(editingQuestion.id, updatedQuestion);
        
        // Update the local state with the form data (not the API response)
        onUpdateQuestion(editingQuestion.id, updatedQuestion);
        setEditingQuestion(null);
        toast({
          title: "Question updated",
          description: "The question has been successfully updated",
        });
      } catch (error) {
        console.error("Error updating question:", error);
        toast({
          title: "Error",
          description: "Failed to update question",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddQuestion = () => {
    setAddingQuestion(true);
  };

  const handleSaveAdd = async (newQuestion: {
    question_text: string;
    question_description: string;
    question_placeholder: string;
  }) => {
    if (onAddQuestion) {
      try {
        await onAddQuestion(newQuestion);
        setAddingQuestion(false);
        toast({
          title: "Question added",
          description: "The question has been successfully added",
        });
      } catch (error) {
        console.error("Error adding question:", error);
        toast({
          title: "Error",
          description: "Failed to add question",
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = (question: Question) => {
    setQuestionToDelete(question);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (questionToDelete) {
      setIsDeleting(true);
      try {
        await onDeleteQuestion(questionToDelete.id);
        toast({
          title: "Question deleted",
          description: "The question has been successfully deleted",
        });
        setDeleteDialogOpen(false);
        setQuestionToDelete(null);
      } catch (error) {
        console.error("Error deleting question:", error);
        toast({
          title: "Error",
          description: "Failed to delete question. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Questions Management</h2>
        <Button onClick={handleAddQuestion}>Add Question</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {safeQuestions.map((question) => (
          <Card key={question.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">{question.question_text}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(question)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(question)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button> */}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground">{question.question_description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Step {question.step_order}</Badge>
                <Badge variant="secondary">Question</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Created: {new Date(question.createdAt).toLocaleDateString()}
              </p>
              {question.question_placeholder && (
                <p className="text-xs text-muted-foreground italic">
                  Placeholder: "{question.question_placeholder}"
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {safeQuestions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">No questions found</p>
        </div>
      )}

      <EditQuestionDialog
        question={editingQuestion}
        open={!!editingQuestion}
        onOpenChange={(open) => !open && setEditingQuestion(null)}
        onSave={handleSaveEdit}
      />

      {/* Add Question Dialog */}
      <EditQuestionDialog
        question={null}
        open={addingQuestion}
        onOpenChange={(open) => !open && setAddingQuestion(false)}
        onSave={handleSaveAdd}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Question"
        description={`Are you sure you want to delete "${questionToDelete?.question_text}"? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        onConfirm={confirmDelete}
        variant="destructive"
        disabled={isDeleting}
      />
    </div>
  );
};
