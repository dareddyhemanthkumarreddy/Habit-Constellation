import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getHabits = async (req, res) => {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'asc' },
    });
    return res.json(habits);
  } catch (error) {
    console.error('Get habits error:', error);
    return res.status(500).json({ error: 'Failed to retrieve habits.' });
  }
};

export const createHabit = async (req, res) => {
  try {
    const { name, icon, category, isCustom } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Habit name is required.' });
    }

    const habit = await prisma.habit.create({
      data: {
        userId: req.user.userId,
        name,
        icon: icon || 'Star',
        category: category || 'General',
        isCustom: isCustom !== undefined ? isCustom : true,
      },
    });

    return res.status(201).json(habit);
  } catch (error) {
    console.error('Create habit error:', error);
    return res.status(500).json({ error: 'Failed to create habit.' });
  }
};

export const updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, category, isArchived } = req.body;

    const habit = await prisma.habit.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found.' });
    }

    const updatedHabit = await prisma.habit.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(icon !== undefined && { icon }),
        ...(category !== undefined && { category }),
        ...(isArchived !== undefined && { isArchived }),
      },
    });

    return res.json(updatedHabit);
  } catch (error) {
    console.error('Update habit error:', error);
    return res.status(500).json({ error: 'Failed to update habit.' });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;

    const habit = await prisma.habit.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found.' });
    }

    await prisma.habit.delete({
      where: { id },
    });

    return res.json({ message: 'Habit removed successfully.' });
  } catch (error) {
    console.error('Delete habit error:', error);
    return res.status(500).json({ error: 'Failed to delete habit.' });
  }
};
