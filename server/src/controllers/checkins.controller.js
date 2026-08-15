import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const toggleCheckin = async (req, res) => {
  try {
    const { habitId, date } = req.body;

    if (!habitId) {
      return res.status(400).json({ error: 'Habit ID is required.' });
    }

    // Verify habit ownership
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId: req.user.userId },
    });

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found.' });
    }

    // Normalize date to UTC midnight (YYYY-MM-DD)
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setUTCHours(0, 0, 0, 0);

    const existingCheckin = await prisma.checkin.findUnique({
      where: {
        habitId_date: {
          habitId,
          date: targetDate,
        },
      },
    });

    if (existingCheckin) {
      // Toggle off: remove checkin if already checked off
      await prisma.checkin.delete({
        where: { id: existingCheckin.id },
      });
      return res.json({ completed: false, checkin: null, message: 'Check-in removed' });
    } else {
      // Toggle on: create checkin
      const checkin = await prisma.checkin.create({
        data: {
          userId: req.user.userId,
          habitId,
          date: targetDate,
        },
      });
      return res.status(201).json({ completed: true, checkin, message: 'Habit complete! Star lit.' });
    }
  } catch (error) {
    console.error('Toggle checkin error:', error);
    return res.status(500).json({ error: 'Failed to record habit check-in.' });
  }
};

export const getCheckins = async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    
    let daysToSubtract = 30;
    if (range === '7d') daysToSubtract = 7;
    if (range === '60d') daysToSubtract = 60;
    if (range === '90d') daysToSubtract = 90;
    if (range === 'all') daysToSubtract = 365 * 5;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysToSubtract);
    startDate.setUTCHours(0, 0, 0, 0);

    const checkins = await prisma.checkin.findMany({
      where: {
        userId: req.user.userId,
        date: {
          gte: startDate,
        },
      },
      include: {
        habit: {
          select: { id: true, name: true, category: true, icon: true }
        }
      },
      orderBy: { date: 'desc' },
    });

    return res.json(checkins);
  } catch (error) {
    console.error('Get checkins error:', error);
    return res.status(500).json({ error: 'Failed to retrieve check-ins.' });
  }
};
