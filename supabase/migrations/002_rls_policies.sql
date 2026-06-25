-- ============================================================
-- Migration 002 : Policies RLS (Row Level Security)
-- À appliquer après 001_init_schema.sql
-- ============================================================
-- Principe : l'API utilise le service role (bypass RLS)
-- Les policies protègent un accès direct éventuel (anon key, dashboard)
-- La colonne auth.uid() correspond au sub du JWT Supabase natif
-- Dans notre cas on passe par le service role, donc ces policies
-- sont une couche de défense en profondeur
-- ============================================================

-- users : lecture et mise à jour de son propre profil uniquement
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (id::text = auth.uid()::text);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (id::text = auth.uid()::text);

-- oauth_tokens : accès à ses propres tokens uniquement
CREATE POLICY "oauth_tokens_own" ON oauth_tokens
  FOR ALL USING (user_id::text = auth.uid()::text);

-- modes : accès à ses propres modes uniquement
CREATE POLICY "modes_own" ON modes
  FOR ALL USING (user_id::text = auth.uid()::text);

-- day_plans : accès à ses propres plans uniquement
CREATE POLICY "day_plans_own" ON day_plans
  FOR ALL USING (user_id::text = auth.uid()::text);

-- time_blocks : accès via les day_plans de l'utilisateur
CREATE POLICY "time_blocks_own" ON time_blocks
  FOR ALL USING (
    day_plan_id IN (
      SELECT id FROM day_plans WHERE user_id::text = auth.uid()::text
    )
  );

-- overrides : accès à ses propres overrides uniquement
CREATE POLICY "overrides_own" ON overrides
  FOR ALL USING (user_id::text = auth.uid()::text);

-- state_transitions : lecture seule de son propre historique
CREATE POLICY "transitions_select_own" ON state_transitions
  FOR SELECT USING (user_id::text = auth.uid()::text);

-- daily_metrics : lecture seule de ses propres métriques
CREATE POLICY "metrics_select_own" ON daily_metrics
  FOR SELECT USING (user_id::text = auth.uid()::text);
