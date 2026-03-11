-- SECURITY HARDENING: Enforce Row Level Security (RLS) on all public tables
-- Auto-generated: March 12, 2026
-- 
-- PURPOSE:
-- Secures the database by closing the 22 vulnerabilities reported by Supabase Security Advisor.
-- Enabling RLS without writing explicit policies ("deny-all") blocks all REST/GraphQL API access 
-- from the public internet (anon/authenticated roles) while still allowing the backend Spring Boot 
-- application to read and write freely via the privileged `postgres` service role.
-- 
-- USAGE:
-- Copy the entirety of this script and paste it into the Supabase SQL Editor, then click Run.

ALTER TABLE public.app_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refresh_tokens_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retirement_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Note: 
-- "user_profiles" and "refresh_tokens_v2" were caught as well.
-- "bank_accounts", "users", "refresh_tokens_v2", and "password_reset_tokens" 
-- resolves the "Sensitive Columns Exposed" warnings since the tables themselves are now locked down.
