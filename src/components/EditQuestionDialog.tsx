import { useEffect, useState } from "react";
import { Question } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditQuestionDialogProps {
  question: Question | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedQuestion: Partial<Question>) => void;
}

export const EditQuestionDialog = ({
  question,
  open,
  onOpenChange,
  onSave,
}: EditQuestionDialogProps) => {
  const [questionText, setQuestionText] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [questionPlaceholder, setQuestionPlaceholder] = useState("");
  const [stepOrder, setStepOrder] = useState(0);

  useEffect(() => {
    if (question) {
      setQuestionText(question.question_text);
      setQuestionDescription(question.question_description);
      setQuestionPlaceholder(question.question_placeholder);
      setStepOrder(question.step_order);
    } else {
      // Reset form for new question
      setQuestionText("");
      setQuestionDescription("");
      setQuestionPlaceholder("");
      setStepOrder(0);
    }
  }, [question]);

  const handleSave = () => {
    if (question) {
      // For editing, include all fields
      onSave({
        question_text: questionText,
        question_description: questionDescription,
        question_placeholder: questionPlaceholder,
        step_order: stepOrder,
      });
    } else {
      // For adding new question, exclude step_order (API will auto-assign)
      onSave({
        question_text: questionText,
        question_description: questionDescription,
        question_placeholder: questionPlaceholder,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{question ? "Edit Question" : "Add New Question"}</DialogTitle>
          <DialogDescription>
            {question 
              ? "Make changes to the question below. Click save when you're done."
              : "Fill in the details for the new question below. Click save when you're done."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="questionText">Question Text</Label>
            <Textarea
              id="questionText"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter question text"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="questionDescription">Question Description</Label>
            <Textarea
              id="questionDescription"
              value={questionDescription}
              onChange={(e) => setQuestionDescription(e.target.value)}
              placeholder="Enter question description"
              rows={4}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="questionPlaceholder">Question Placeholder</Label>
            <Input
              id="questionPlaceholder"
              value={questionPlaceholder}
              onChange={(e) => setQuestionPlaceholder(e.target.value)}
              placeholder="Enter question placeholder"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{question ? "Save changes" : "Add question"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
