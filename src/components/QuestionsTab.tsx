import { useState } from "react";
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { EditQuestionDialog } from "./EditQuestionDialog";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { toast } from "@/hooks/use-toast";

interface QuestionsTabProps {
  questions: Question[];
  onUpdateQuestion: (questionId: string, updatedQuestion: Partial<Question>) => void;
  onDeleteQuestion: (questionId: string) => void;
}

export const QuestionsTab = ({
  questions,
  onUpdateQuestion,
  onDeleteQuestion,
}: QuestionsTabProps) => {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

  // Safety check to ensure questions is an array
  const safeQuestions = Array.isArray(questions) ? questions : [];

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
  };

  const handleSaveEdit = (updatedQuestion: Partial<Question>) => {
    if (editingQuestion) {
      onUpdateQuestion(editingQuestion.id, updatedQuestion);
      setEditingQuestion(null);
      toast({
        title: "Question updated",
        description: "The question has been successfully updated",
      });
    }
  };

  const handleDelete = (question: Question) => {
    setQuestionToDelete(question);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (questionToDelete) {
      onDeleteQuestion(questionToDelete.id);
      toast({
        title: "Question deleted",
        description: "The question has been successfully deleted",
      });
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Questions Management</h2>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(question)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Question"
        description={`Are you sure you want to delete "${questionToDelete?.question_text}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
};
