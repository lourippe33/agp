import { test, expect } from '@playwright/test';

test('home charge sans erreur console', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', msg => { 
    if (msg.type() === 'error') errors.push(msg.text()); 
  });

  await page.goto('/');
  
  // Si app protégée par login, vérifier la page login :
  await expect(page.locator('text=/connexion|login|AGP/i')).toBeVisible({ timeout: 30000 });
  
  expect(errors, 'Aucune erreur console ne doit apparaître').toEqual([]);
});

test('routes clés répondent', async ({ page }) => {
  await page.goto('/recettes');
  // Si redirection vers /auth/login, c'est OK aussi
  await expect(page).toHaveURL(/(recettes|auth\/login)/);
  
  await page.goto('/sport');
  await expect(page).toHaveURL(/(sport|auth\/login)/);
  
  await page.goto('/detente');
  await expect(page).toHaveURL(/(detente|auth\/login)/);
});