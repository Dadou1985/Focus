# Supabase — Migrations

## Appliquer le schéma

### Sur Supabase (production / staging)

1. Aller dans le dashboard Supabase → SQL Editor
2. Copier-coller le contenu de `migrations/001_init_schema.sql`
3. Exécuter

### En local (Docker Compose)

```bash
# Démarrer la base
docker compose up postgres -d

# Appliquer le schéma
docker compose exec postgres psql -U postgres -d mode_saas -f /dev/stdin < supabase/migrations/001_init_schema.sql

# Seed de dev (optionnel)
docker compose exec postgres psql -U postgres -d mode_saas -f /dev/stdin < supabase/seed.sql
```

## Tables

| Table               | Description                                      |
|---------------------|--------------------------------------------------|
| `users`             | Comptes utilisateurs (via Google OAuth)          |
| `oauth_tokens`      | Tokens Google & Slack (chiffrés)                 |
| `modes`             | Config des 4 modes par utilisateur               |
| `day_plans`         | Plans journaliers                                |
| `time_blocks`       | Blocs horaires dans un plan                      |
| `overrides`         | Basculements manuels temporaires                 |
| `state_transitions` | Journal de toutes les transitions (audit trail)  |
| `daily_metrics`     | Métriques agrégées par jour                      |
