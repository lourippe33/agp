import { LocalStorageService } from './LocalStorageService';
import { JournalEntry } from '@/types/Journal';

const JOURNAL_KEYS = {
  JOURNAL_ENTRY: '@agp_journal_entry',
};

export class JournalService {
  // Récupérer une entrée de journal
  static async getJournalEntry(userId: string, date: string): Promise<JournalEntry | null> {
    try {
      const entryJson = await LocalStorageService.getItem(`${JOURNAL_KEYS.JOURNAL_ENTRY}_${userId}_${date}`);
      return entryJson ? JSON.parse(entryJson) : null;
    } catch (error) {
      console.error('Erreur récupération journal:', error);
      return null;
    }
  }

  // Sauvegarder une entrée de journal
  static async saveJournalEntry(userId: string, entry: JournalEntry): Promise<void> {
    try {
      await LocalStorageService.setItem(
        `${JOURNAL_KEYS.JOURNAL_ENTRY}_${userId}_${entry.date}`, 
        JSON.stringify(entry)
      );
    } catch (error) {
      console.error('Erreur sauvegarde journal:', error);
    }
  }

  // Récupérer les entrées de journal pour une période
  static async getJournalEntries(userId: string, startDate: string, endDate: string): Promise<JournalEntry[]> {
    try {
      const entries: JournalEntry[] = [];
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dateStr = date.toISOString().split('T')[0];
        const entry = await this.getJournalEntry(userId, dateStr);
        if (entry) {
          entries.push(entry);
        }
      }
      
      return entries;
    } catch (error) {
      console.error('Erreur récupération journaux:', error);
      return [];
    }
  }

  // Calculer les statistiques du journal
  static calculateJournalStats(entries: JournalEntry[]) {
    if (entries.length === 0) {
      return {
        totalMeals: 0,
        consumedMeals: 0,
        averageWaterIntake: 0,
        completionRate: 0,
      };
    }

    const totalMeals = entries.reduce((sum, entry) => sum + entry.meals.length, 0);
    const consumedMeals = entries.reduce((sum, entry) => 
      sum + entry.meals.filter(meal => meal.consumed).length, 0
    );
    const totalWaterIntake = entries.reduce((sum, entry) => sum + entry.waterIntake, 0);
    const averageWaterIntake = totalWaterIntake / entries.length;
    const completionRate = (consumedMeals / totalMeals) * 100;

    return {
      totalMeals,
      consumedMeals,
      averageWaterIntake,
      completionRate,
    };
  }

  // Générer un ID unique
  static generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}