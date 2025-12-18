/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import {
  fetchUserContributions,
  getGithubToken,
  fetchCurrentYearContributions,
} from "../github/github";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Octokit } from "octokit";
import { headers } from "next/headers";

export async function getCurrentContributionStats() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("No session found || Unauthorized , Sorry");
    }

    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    const { data: user } = await octokit.rest.users.getAuthenticated();
    const username = user.login;
    const calendar = await fetchCurrentYearContributions(token!, username);

    if (!calendar) {
      return [];
    }

    const contributionCurrent = calendar.weeks.flatMap((week: any) =>
      week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
        level: Math.min(4, Math.floor(day.contributionCount / 3)),
      }))
    );

    return {
      contributionCurrent,
      totalContributions: calendar.totalContributions,
    };
  } catch (error) {
    console.log(error);
    return {
      contributions: [],
      totalContributions: 0,
    };
  }
}

export async function getContributionStats() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("No session found || Unauthorized , Sorry");
    }

    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    const { data: user } = await octokit.rest.users.getAuthenticated();
    const username = user.login;
    const calendar = await fetchUserContributions(token!, username);

    if (!calendar) {
      return [];
    }

    const contributions = calendar.weeks.flatMap((week: any) =>
      week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
        level: Math.min(4, Math.floor(day.contributionCount / 3)),
      }))
    );

    return {
      contributions,
      totalContributions: calendar.totalContributions,
    };
  } catch (error) {
    console.log(error);
    return {
      contributions: [],
      totalContributions: 0,
    };
  }
}

export async function getUserGithubDetails() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("No session found || Unauthorized , Sorry");
    }

    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    const { data: user } = await octokit.rest.users.getAuthenticated();
    const github_username = user.login;

    return {
      github_username,
    };
  } catch (error) {
    console.log(error);
    return {
      github_username: "",
    };
  }
}

export async function getDahboardStats() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("No session found || Unauthorized , Sorry");
    }

    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    //  Gets users Github name.................
    const { data: user } = await octokit.rest.users.getAuthenticated();
    // Fetch Total Connected Repo from DB..............
    const totalRepos = 30; // just for demo

    const calendar = await fetchUserContributions(token!, user.login);
    const totalCommits = calendar?.totalContributions || 0;

    // console.log("GitHub token exists:", !!token);
    // console.log("GitHub username:", user.login);
    // console.log("Contribution calendar:", calendar);

    // Count pr from github or db..............
    const { data: pr } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr`,
      per_page: 1,
    });

    const totalpr = pr?.total_count || 0;

    // count AI reviews from db ..............
    const totalReviews = 44; //demo

    // Commit count for the cureent connected repo..............

    // Languages used in the current selected Repos..............

    return {
      totalCommits,
      totalpr,
      totalReviews,
      totalRepos,
    };
  } catch (error) {
    console.log(error);
    return {
      totalCommits: 0,
      totalpr: 0,
      totalReviews: 0,
      totalRepos: 0,
    };
  }
}

export async function getMonthlyActivity() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized or user Not found Sorry !");
    }
    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    const { data: user } = await octokit.rest.users.getAuthenticated();

    const calendar = await fetchUserContributions(token!, user.login);

    if (!calendar) {
      return [];
    }

    // fetches your commits
    //  -- get your contribution calendar
    //  -- counts how many commits u made each month
    // fetches your code review
    //  -- grouping by 6 months
    // fetches your all PR
    // -- all pr last 6 month
    // -- counts how mnay u did each month
    // -- organizes each month and for each month , number of commits , pr , code review u made

    const monthlyData: {
      [key: string]: { commits: number; prs: number; reviews: number };
    } = {};

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Initialize last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = monthNames[date.getMonth()];
      monthlyData[monthKey] = { commits: 0, prs: 0, reviews: 0 };
    }

    calendar.weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        const date = new Date(day.date);
        const monthKey = monthNames[date.getMonth()];
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].commits += day.contributionCount;
        }
      });
    });

    // Fetch reviews from database for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // TODO: REVIEWS'S REAL DATA
    const generateSampleReviews = () => {
      const sampleReviews = [];
      const now = new Date();

      // Generate random reviews over the past 6 months
      for (let i = 0; i < 45; i++) {
        const randomDaysAgo = Math.floor(Math.random() * 180); // Random day in last 6 months
        const reviewDate = new Date(now);
        reviewDate.setDate(reviewDate.getDate() - randomDaysAgo);

        sampleReviews.push({
          createdAt: reviewDate,
        });
      }

      return sampleReviews;
    };

    const reviews = generateSampleReviews();

    reviews.forEach((review) => {
      const monthKey = monthNames[review.createdAt.getMonth()];
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].reviews += 1;
      }
    });

    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr created:>${
        sixMonthsAgo.toISOString().split("T")[0]
      }`,
      per_page: 100,
    });

    prs.items.forEach((pr: any) => {
      const date = new Date(pr.created_at);
      const monthKey = monthNames[date.getMonth()];
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].prs += 1;
      }
    });

    return Object.keys(monthlyData).map((name) => ({
      name,
      ...monthlyData[name],
    }));
  } catch (error) {
    console.error("Error fetching monthly activity:", error);
    return [];
  }
}
