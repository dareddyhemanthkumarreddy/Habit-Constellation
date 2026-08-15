import { create } from 'zustand';
import api from '../services/api';

export const useHabitStore = create((set, get) => ({
  habits: [],
  checkins: [],
  latestInsight: null,
  insightsHistory: [],
  loadingHabits: false,
  loadingCheckins: false,
  loadingInsight: false,
  error: null,

  // Fetch all habits
  fetchHabits: async () => {
    set({ loadingHabits: true });
    try {
      const res = await api.get('/habits');
      set({ habits: res.data, loadingHabits: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to fetch habits', loadingHabits: false });
    }
  },

  // Fetch checkins for range
  fetchCheckins: async (range = '30d') => {
    set({ loadingCheckins: true });
    try {
      const res = await api.get(`/checkins?range=${range}`);
      set({ checkins: res.data, loadingCheckins: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to fetch checkins', loadingCheckins: false });
    }
  },

  // Toggle habit checkin (idempotent, real-time update)
  toggleCheckin: async (habitId, dateStr = null) => {
    const targetDateStr = dateStr || new Date().toISOString().split('T')[0];
    
    try {
      const res = await api.post('/checkins', { habitId, date: targetDateStr });
      const { completed } = res.data;

      // Update state locally immediately
      const currentCheckins = get().checkins;
      if (completed) {
        set({ checkins: [res.data.checkin, ...currentCheckins] });
      } else {
        set({
          checkins: currentCheckins.filter(
            (c) => !(c.habitId === habitId && new Date(c.date).toISOString().split('T')[0] === targetDateStr)
          ),
        });
      }
      return completed;
    } catch (err) {
      console.error('Toggle checkin failed', err);
      throw err;
    }
  },

  // Add habit
  addHabit: async (habitData) => {
    try {
      const res = await api.post('/habits', habitData);
      set({ habits: [...get().habits, res.data] });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to add habit' });
      throw err;
    }
  },

  // Update/Archive habit
  updateHabit: async (id, updates) => {
    try {
      const res = await api.post ? await api.patch(`/habits/${id}`, updates) : null;
      set({
        habits: get().habits.map((h) => (h.id === id ? res.data : h)),
      });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to update habit' });
      throw err;
    }
  },

  // Delete habit
  deleteHabit: async (id) => {
    try {
      await api.delete(`/habits/${id}`);
      set({
        habits: get().habits.filter((h) => h.id !== id),
      });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to delete habit' });
      throw err;
    }
  },

  // Fetch Latest Insight
  fetchLatestInsight: async () => {
    set({ loadingInsight: true });
    try {
      const res = await api.get('/insights/latest');
      set({ latestInsight: res.data, loadingInsight: false });
    } catch (err) {
      set({ loadingInsight: false });
    }
  },

  // Generate New Insight
  generateNewInsight: async () => {
    set({ loadingInsight: true });
    try {
      const res = await api.post('/insights/generate');
      set({
        latestInsight: res.data,
        insightsHistory: [res.data, ...get().insightsHistory],
        loadingInsight: false,
      });
      return res.data;
    } catch (err) {
      set({ loadingInsight: false });
      throw err;
    }
  },

  // Fetch Insight History
  fetchInsightHistory: async () => {
    try {
      const res = await api.get('/insights');
      set({ insightsHistory: res.data });
    } catch (err) {
      console.error('Fetch history failed', err);
    }
  },
}));
