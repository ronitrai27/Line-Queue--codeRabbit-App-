/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getRepositories } from "../github/github";
export const fetchrepo = async (page: number = 1, perPage: number = 10) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("No session found || Unauthorized , Sorry");
  }

  const githubRepos = await getRepositories(page, perPage);

  const dbRepos = await prisma.repository.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const connectedRepoIds = new Set(dbRepos.map((repo) => repo.githubId));

  return githubRepos.map((repo: any) => ({
    ...repo,
    isConnected: connectedRepoIds.has(BigInt(repo.id)),
  }));
};
