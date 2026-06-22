-- ============================================================
-- Mode SaaS — Migration 001 : Schéma initial
-- ============================================================

-- Extension UUID (disponible nativement dans Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE : users
-- Correspond aux comptes Google OAuth
-- ============================================================
CREATE TABLE users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  avatar_url   TEXT,
  timezone     TEXT NOT NULL DEFAULT 'Europe/Paris',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE : oauth_tokens
-- Stocke les tokens Google & Slack chiffrés (colonne encrypted_*)
-- On ne stocke JAMAIS les tokens en clair
-- ============================================================
CREATE TABLE oauth_tokens (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider        TEXT NOT NULL CHECK (provider IN ('google', 'slack')),
  access_token    TEXT NOT NULL,   -- chiffré en AES-256
  refresh_token   TEXT,            -- chiffré en AES-256
  expires_at      TIMESTAMPTZ,
  scopes          TEXT[],
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, provider)
);

-- ============================================================
-- TABLE : modes
-- Les 4 modes de travail par utilisateur (config personnalisable)
-- ============================================================
CREATE TABLE modes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type             TEXT NOT NULL CHECK (type IN ('focus', 'collaboration', 'admin', 'urgence')),
  name             TEXT NOT NULL,
  emoji            TEXT NOT NULL,
  color            TEXT NOT NULL,
  description      TEXT,
  slack_status     TEXT,
  slack_emoji      TEXT,
  dnd_enabled      BOOLEAN NOT NULL DEFAULT FALSE,
  gmail_signature  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, type)
);

-- ============================================================
-- TABLE : day_plans
-- Plan journalier : un par utilisateur par date
-- ============================================================
CREATE TABLE day_plans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'validated')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, date)
);

-- ============================================================
-- TABLE : time_blocks
-- Blocs horaires dans un plan journalier
-- ============================================================
CREATE TABLE time_blocks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_plan_id  UUID NOT NULL REFERENCES day_plans(id) ON DELETE CASCADE,
  mode_type    TEXT NOT NULL CHECK (mode_type IN ('focus', 'collaboration', 'admin', 'urgence')),
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  title        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT time_block_valid CHECK (end_time > start_time)
);

-- ============================================================
-- TABLE : overrides
-- Basculements manuels temporaires (ex: urgence 30 min)
-- ============================================================
CREATE TABLE overrides (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mode_type   TEXT NOT NULL CHECK (mode_type IN ('focus', 'collaboration', 'admin', 'urgence')),
  reason      TEXT,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE : state_transitions
-- Journal de toutes les transitions d'état (audit trail)
-- ============================================================
CREATE TABLE state_transitions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_mode     TEXT CHECK (from_mode IN ('focus', 'collaboration', 'admin', 'urgence')),
  to_mode       TEXT NOT NULL CHECK (to_mode IN ('focus', 'collaboration', 'admin', 'urgence')),
  trigger       TEXT NOT NULL CHECK (trigger IN ('schedule', 'override', 'manual')),
  triggered_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE : daily_metrics
-- Métriques agrégées par jour (calculées par le moteur)
-- ============================================================
CREATE TABLE daily_metrics (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date                    DATE NOT NULL,
  focus_minutes           INT NOT NULL DEFAULT 0,
  collaboration_minutes   INT NOT NULL DEFAULT 0,
  admin_minutes           INT NOT NULL DEFAULT 0,
  urgence_minutes         INT NOT NULL DEFAULT 0,
  override_count          INT NOT NULL DEFAULT 0,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, date)
);

-- ============================================================
-- INDEX
-- On indexe systématiquement les foreign keys et les colonnes
-- de recherche fréquentes (user_id, date, expires_at)
-- ============================================================
CREATE INDEX idx_oauth_tokens_user_id    ON oauth_tokens(user_id);
CREATE INDEX idx_modes_user_id           ON modes(user_id);
CREATE INDEX idx_day_plans_user_date     ON day_plans(user_id, date);
CREATE INDEX idx_time_blocks_day_plan    ON time_blocks(day_plan_id);
CREATE INDEX idx_overrides_user_expires  ON overrides(user_id, expires_at);
CREATE INDEX idx_transitions_user        ON state_transitions(user_id, triggered_at DESC);
CREATE INDEX idx_daily_metrics_user_date ON daily_metrics(user_id, date DESC);

-- ============================================================
-- TRIGGER : updated_at automatique
-- Évite de gérer manuellement les timestamps dans l'API
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_oauth_tokens_updated_at
  BEFORE UPDATE ON oauth_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_modes_updated_at
  BEFORE UPDATE ON modes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_day_plans_updated_at
  BEFORE UPDATE ON day_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_daily_metrics_updated_at
  BEFORE UPDATE ON daily_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Chaque utilisateur ne voit que ses propres données
-- Supabase active RLS automatiquement via les policies JWT
-- ============================================================
ALTER TABLE users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_tokens    ENABLE ROW LEVEL SECURITY;
ALTER TABLE modes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_plans       ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_blocks     ENABLE ROW LEVEL SECURITY;
ALTER TABLE overrides       ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics   ENABLE ROW LEVEL SECURITY;

-- Policy : l'API (service role) a un accès total
-- Les policies utilisateur seront ajoutées lors de l'implémentation Auth (SCRUM-90)
