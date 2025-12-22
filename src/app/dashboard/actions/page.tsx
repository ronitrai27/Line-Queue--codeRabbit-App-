import { Play } from "lucide-react";
import React from "react";

const ActionPage = () => {
  return (
    <div className="">
      <h1 className="font-bold tracking-wide text-3xl">Actions </h1>
      <h3 className="text-base text-muted-foreground mt-1">
        Manage Your Workflows & Tasks Here
        <Play className="inline ml-2 w-4 h-4" />
      </h3>
    </div>
  );
};

export default ActionPage;
