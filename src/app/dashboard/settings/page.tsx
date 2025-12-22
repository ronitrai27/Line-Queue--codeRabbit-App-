"use client";

import { RepositoryListPage } from "@/components/custom/Repo-list";
import { Settings } from "lucide-react";
import React from "react";

const SettingPage = () => {
  return (
    <div>
      <h1 className="font-bold tracking-wide text-3xl">Settings</h1>
      <h3 className="text-base text-muted-foreground mt-1">
        Manage your Settings and Connected Repos
        <Settings className="inline ml-2 w-4 h-4" />
      </h3>
      <div className="my-6 px-6">
        <RepositoryListPage />
      </div>
    </div>
  );
};

export default SettingPage;
