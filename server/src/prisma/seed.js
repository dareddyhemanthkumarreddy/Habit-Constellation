import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const PRESET_HABITS = [
  // Body
  { name: 'Morning Stretch', icon: 'Activity', category: 'Body' },
  { name: 'Drink 2L Water', icon: 'Droplets', category: 'Body' },
  { name: '30-min Walk', icon: 'Footprints', category: 'Body' },
  { name: 'Nourishing Meal', icon: 'Apple', category: 'Body' },
  
  // Mind
  { name: '10-min Meditation', icon: 'Brain', category: 'Mind' },
  { name: 'Read 15 Pages', icon: 'BookOpen', category: 'Mind' },
  { name: 'Journal Thoughts', icon: 'Feather', category: 'Mind' },
  { name: 'Deep Focus Work', icon: 'Zap', category: 'Mind' },

  // Connection
  { name: 'Call a Friend', icon: 'PhoneCall', category: 'Connection' },
  { name: 'Express Gratitude', icon: 'Heart', category: 'Connection' },
  { name: 'Acts of Kindness', icon: 'Smile', category: 'Connection' },
  { name: 'Quality Time', icon: 'Users', category: 'Connection' },

  // Rest
  { name: 'Unplug Before Bed', icon: 'Moon', category: 'Rest' },
  { name: '8 Hours Sleep', icon: 'Bed', category: 'Rest' },
  { name: 'Nature Walk', icon: 'Trees', category: 'Rest' },
  { name: 'Breathing Break', icon: 'Wind', category: 'Rest' }
];

async function main() {
  console.log('Seeding process initialized. Preset habits available for frontend preset picker.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
