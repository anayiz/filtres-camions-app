# Checklist propriétaire

- [ ] Définir un vrai mot de passe admin en production.
- [ ] Remplacer le numéro WhatsApp par le bon contact.
- [ ] Vérifier que le dossier `DATA_DIR` est persistant.
- [ ] Vérifier que le site est servi avec HTTPS.
- [ ] Vérifier le quota disque et la sauvegarde automatique.
- [ ] Tester le flux client : ajout au panier, commande, WhatsApp.
- [ ] Tester le flux admin : connexion, statut, stock, suppression.
- [ ] Revoir les contrôles de sécurité et l'accès direct au port.

## Identité et localisation

- [ ] Mettre les vraies informations de l’entreprise dans `public/config.js` : nom, slogan, téléphone, WhatsApp, email, adresse, horaires et liens sociaux.
- [ ] Vérifier la langue par défaut et la liste des wilayas dans `public/config.js`.
- [ ] Contrôler le bloc “Contact” et la carte dans `public/index.html` après insertion des données réelles.
- [ ] Vérifier que le sélecteur de langue fonctionne en RTL/RTL et que le stockage local `ftc-lang` est bien utilisé.
- [ ] Ajuster l’URL de carte, le contact, et la zone de livraison selon la vraie zone commerciale (wilayas couvertes).
