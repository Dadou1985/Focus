-- ============================================================
-- Mode SaaS — Seed de développement
-- Ne PAS exécuter en production
-- ============================================================

-- Utilisateur de test
INSERT INTO users (id, email, name, timezone) VALUES
  ('00000000-0000-0000-0000-000000000001', 'dev@mode-saas.local', 'Dev User', 'Europe/Paris')
ON CONFLICT (email) DO NOTHING;

-- 4 modes par défaut pour l'utilisateur de test
INSERT INTO modes (user_id, type, name, emoji, color, description, slack_status, slack_emoji, dnd_enabled, gmail_signature) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'focus', 'Focus', '🎯', '#6366f1',
    'Travail profond, pas de distractions',
    'En mode Focus — ne pas déranger', ':no_entry_sign:', TRUE,
    'Je suis en mode concentration. Je répondrai dès que possible.'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'collaboration', 'Collaboration', '🤝', '#22c55e',
    'Disponible pour les échanges et réunions',
    'Disponible pour collaborer', ':handshake:', FALSE,
    'Disponible pour échanger. N''hésitez pas à me contacter.'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'admin', 'Admin', '📋', '#f59e0b',
    'Tâches administratives et emails',
    'Mode Admin — emails et tâches', ':clipboard:', FALSE,
    'Je traite mes emails et tâches administratives.'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'urgence', 'Urgence', '🚨', '#ef4444',
    'Situation urgente — disponible immédiatement',
    '🚨 URGENCE — disponible immédiatement', ':rotating_light:', FALSE,
    'Situation urgente en cours. Je suis disponible immédiatement.'
  )
ON CONFLICT (user_id, type) DO NOTHING;
