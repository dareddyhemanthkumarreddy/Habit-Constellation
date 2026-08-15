import { PrismaClient } from '@prisma/client';
import { generatePatternInsight } from '../services/ai.service.js';

const prisma = new PrismaClient();

const getWeekStart = (d = new Date()) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday as week start
  const monday = new Date(date.setDate(diff));
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
};

export const generateInsight = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch user's habits and last 30 days of checkins
    const habits = await prisma.habit.findMany({
      where: { userId, isArchived: false },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setUTCHours(0, 0, 0, 0);

    const checkins = await prisma.checkin.findMany({
      where: {
        userId,
        date: { gte: thirtyDaysAgo },
      },
    });

    // Call AI service
    const insightContent = await generatePatternInsight(habits, checkins);

    const weekStart = getWeekStart();

    // Store generated insight
    const newInsight = await prisma.insight.create({
      data: {
        userId,
        weekStart,
        content: insightContent,
      },
    });

    return res.status(201).json(newInsight);
  } catch (error) {
    console.error('Generate insight error:', error);
    return res.status(500).json({ error: 'Failed to generate AI pattern insight.' });
  }
};

export const getLatestInsight = async (req, res) => {
  try {
    const userId = req.user.userId;

    let latest = await prisma.insight.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Auto-generate if no insight exists yet
    if (!latest) {
      const habits = await prisma.habit.findMany({ where: { userId, isArchived: false } });
      const checkins = await prisma.checkin.findMany({ where: { userId } });
      const content = await generatePatternInsight(habits, checkins);
      const weekStart = getWeekStart();

      latest = await prisma.insight.create({
        data: { userId, weekStart, content },
      });
    }

    return res.json(latest);
  } catch (error) {
    console.error('Get latest insight error:', error);
    return res.status(500).json({ error: 'Failed to fetch latest insight.' });
  }
};

export const getInsightHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const history = await prisma.insight.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return res.json(history);
  } catch (error) {
    console.error('Get insight history error:', error);
    return res.status(500).json({ error: 'Failed to retrieve insight history.' });
  }
};
