import Anthropic from '@anthropic-ai/sdk';

export const generatePatternInsight = async (habits, checkins) => {
  // 1. Aggregate check-in patterns by habit and day of week
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const summary = habits.map(habit => {
    const habitCheckins = checkins.filter(c => c.habitId === habit.id);
    const dayCounts = { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 };
    
    habitCheckins.forEach(c => {
      const dayName = daysOfWeek[new Date(c.date).getDay()];
      dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
    });

    return {
      habitName: habit.name,
      category: habit.category || 'General',
      totalCompletions: habitCheckins.length,
      completionsByDay: dayCounts
    };
  });

  const totalCheckins = checkins.length;

  // Check if Anthropic API key is set
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey && apiKey !== 'your_anthropic_api_key_here' && apiKey.trim() !== '') {
    try {
      const anthropic = new Anthropic({ apiKey });
      const prompt = `You are a warm, supportive wellness companion analyzing a user's habit constellation patterns over recent weeks.

Habit Completion Data Summary:
${JSON.stringify(summary, null, 2)}
Total stars illuminated: ${totalCheckins}

Guidelines:
- Offer ONE gentle pattern observation about their star constellation (e.g. which days shine brightest, or which category of habits grounds them).
- Offer ONE tiny, achievable, non-clinical suggestion (e.g. adding a light weekend habit or celebrating a glowing midweek cluster).
- Keep the tone like an encouraging friend looking at a star map — never clinical, never preachy, no streak-shaming.
- Limit to 2-3 short, beautiful sentences.`;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }]
      });

      if (response && response.content && response.content[0] && response.content[0].text) {
        return response.content[0].text.trim();
      }
    } catch (err) {
      console.warn('Anthropic API call notice (using graceful warm fallback):', err.message);
    }
  }

  // Smart, non-clinical fallback insight generator if API key is not present or API call fails
  if (totalCheckins === 0) {
    return "Your night sky is waiting for its first spark. Try checking off a simple habit today to light your first star!";
  }

  // Find brightest day and top habit
  const dayTotals = { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 };
  summary.forEach(s => {
    Object.entries(s.completionsByDay).forEach(([day, count]) => {
      dayTotals[day] += count;
    });
  });

  const brightestDay = Object.entries(dayTotals).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  const topHabit = summary.reduce((a, b) => (b.totalCompletions > a.totalCompletions ? b : a), summary[0]);

  return `Your constellation glows brightest on ${brightestDay}s, with "${topHabit?.habitName || 'your core habits'}" adding a steady warm light to your night sky. If weekends feel a bit dimmer, consider pairing a lighter 2-minute habit with your morning rest routine!`;
};
