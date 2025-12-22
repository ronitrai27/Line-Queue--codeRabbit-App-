/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { deleteWebhook } from "../github/github";

export async function getUserProfile() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("No session found || Unauthorized , Sorry");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error: any) {
    console.log(error);
    return null;
  }
}

export async function updateUserProfile(data: {
  name?: string;
  email?: string;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("No session found || Unauthorized , Sorry");
    }
    const updateUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: data.name,
        email: data.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    revalidatePath("/dashboard/settings", "page");
    return {
      success: true,
      user: updateUser,
    };
  } catch (error: any) {
    console.log("error updating !", error);
    return { success: false, error: error.message };
  }
}

// =======================================
// TO GET ALL CONNECTED REPO FROM DB
// =======================================

export async function getConnectedRepositories() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("No session found || Unauthorized , Sorry");
    }

    // finding from db....
    const repo = await prisma.repository.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        owner: true,
        fullName: true,
        githubId: true,
        createdAt: true,
        url: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return repo;
  } catch (error: any) {
    console.log(error);
    return [];
  }
}

// =======================================
// TO Disconnect Repo
// =======================================

export async function disconnectRepo(repoId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("No session found || Unauthorized , Sorry");
    }

    const repository = await prisma.repository.findUnique({
      where: {
        id: repoId,
        userId: session.user.id,
      },
    });

    if (!repository) {
      throw new Error("Repository not found");
    }

    await deleteWebhook(repository.owner, repository.name);

    await prisma.repository.delete({
      where: {
        id: repoId,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/settings", "page");
    revalidatePath("/dashboard/repository", "page");

    return { success: true };
  } catch (error: any) {
    console.log(error);
    return [];
  }
}

// =======================================
// TO Disconnect ALL REPO AT ONCE
// =======================================

export async function disconnectAllRepo() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("No session found || Unauthorized , Sorry");
    }

    const repository = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
    });

    await Promise.all(
      repository.map(async (repo) => {
        await deleteWebhook(repo.owner, repo.name);
      })
    );

    const result = await prisma.repository.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/settings", "page");
    revalidatePath("/dashboard/repository", "page");

    return { success: true, count: result.count };
  } catch (error: any) {
    console.log(error);
    return { success: false, error: error.message };
  }
}
