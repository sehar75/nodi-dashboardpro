import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome to Admin Dashboard 👋</h1>
        <p className="mt-2 text-muted-foreground">
          Use the sidebar to navigate to Users and Questions.
        </p>
      </div>
    </div>
  );
};

export default Index;
