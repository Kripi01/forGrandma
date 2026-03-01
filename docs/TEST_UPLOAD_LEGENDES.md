# Données pour tester l’image légendée (feature 0002)

## 1. Image de test (recommandé)

1. **Générer une fausse radio avec du texte**  
   Ouvrez dans le navigateur : **`docs/generer-image-test.html`**  
   - Cliquez sur **« Enregistrer l’image (PNG) »**.  
   - Un fichier `test-radio-legendes.png` est téléchargé.

2. **Dans l’app For GrandMa**  
   - Cliquez sur **Photo** (ou prenez une photo).  
   - Sélectionnez le PNG enregistré.  
   - Cliquez sur **« Comprendre ce rapport »** → l’OCR extrait le texte de l’image.  
   - Répondez (ou non) aux questions de contexte, puis **« Lancer l’analyse »**.  
   - À la fin : le bloc **« Votre image légendée »** s’affiche avec des flèches générées par le LLM. Vous pouvez poser des questions dans le chat en vous référant à l’image.

## 2. Tester avec un vrai cliché (optionnel)

Si vous voulez tester avec une image type radio/IRM réelle (sans données personnelles) :

- **Ressources libres** (à télécharger puis uploader via « Photo ») :  
  - [Radiopaedia – cas éducatifs](https://radiopaedia.org) (images sous licence pour usage éducatif).  
  - [Wikipedia Commons – Chest X-Ray](https://commons.wikimedia.org/wiki/Category:Chest_radiographs) (vérifier la licence de chaque image).

Pour que les légendes aient du sens, l’image doit correspondre à un « rapport » : soit vous uploadez une image qui contient du texte (comme la fausse radio générée ci‑dessus), soit vous devrez avoir un flux où le texte du rapport et l’image sont associés (non implémenté ici : on part du principe que l’image **est** le document et l’OCR fournit le texte).

## 3. Tester sans image (PDF uniquement)

- Uploadez un **PDF** de rapport (ex. `docs/rapport_test.pdf` si présent).  
- Dans ce cas, **aucun bloc « Votre image légendée »** n’apparaît (comportement attendu).

## Résumé

| Source        | Fichier à utiliser              | Résultat attendu                                      |
|---------------|----------------------------------|--------------------------------------------------------|
| Image de test | PNG depuis `generer-image-test.html` | OCR → analyse → image légendée avec flèches + chat qui s’y réfère |
| PDF           | `rapport_test.pdf` ou autre     | Analyse + explication, pas d’image légendée           |
