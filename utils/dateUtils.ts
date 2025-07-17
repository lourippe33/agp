/**
 * Vérifie si une date est dans le passé (avant aujourd'hui)
 * @param date La date à vérifier
 * @returns true si la date est dans le passé, false sinon
 */
export function isPastDay(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  return checkDate.getTime() < today.getTime();
}

/**
 * Vérifie si deux dates sont le même jour
 * @param date1 Première date
 * @param date2 Deuxième date
 * @returns true si les deux dates sont le même jour, false sinon
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Formate une date au format français
 * @param date La date à formater
 * @param options Options de formatage
 * @returns La date formatée
 */
export function formatDate(date: Date, options: Intl.DateTimeFormatOptions = {}): string {
  return date.toLocaleDateString('fr-FR', options);
}