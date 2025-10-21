import { useState } from "react";
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { EditQuestionDialog } from "./EditQuestionDialog";
import { toast } from "@/hooks/use-toast";

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

  const handleSaveEdit = async (updatedQuestion: Partial<Question>) => {
    if (!editingQuestion) return;
    
    try {
      onUpdateQuestion(editingQuestion.id, updatedQuestion);
      setEditingQuestion(null);
      toast({
        title: "Question updated",
        description: "The question has been successfully updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update question",
        variant: "destructive",
      });
    }
  };

  const handleSaveAdd = async (newQuestion: {
    question_text: string;
    question_description: string;
    question_placeholder: string;
  }) => {
    if (!onAddQuestion) return;
    
    try {
      await onAddQuestion(newQuestion);
      setAddingQuestion(false);
      toast({
        title: "Question added",
        description: "The question has been successfully added",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add question",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Questions Management</h2>
        <Button onClick={() => setAddingQuestion(true)}>Add Question</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {questions.map((question) => (
          <Card key={question.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">{question.question_text}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingQuestion(question)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
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

      {questions.length === 0 && (
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

      <EditQuestionDialog
        question={null}
        open={addingQuestion}
        onOpenChange={(open) => !open && setAddingQuestion(false)}
        onSave={handleSaveAdd}
      />
    </div>
  );
};
