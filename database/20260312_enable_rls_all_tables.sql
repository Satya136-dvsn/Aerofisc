-- FIXED RLS SCRIPT FOR SUPABASE CONNECTION POOLERS
-- When connecting to Supabase via the IPv4 connection pooler (port 6543) or PgBouncer, 
-- explicit `authenticated` or `service_role` session states are sometimes lost, or the pooler 
-- forces the connection into an unprivileged state that cannot bypass RLS.
-- This script safely enables RLS while explicitly creating a universal bypass policy 
-- ONLY for the internal `postgres` backend user.

-- 1. Enable RLS (Locks out the public REST API)
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

-- 2. Grant explicit full-access policies to the `postgres` role
-- Since the `postgres` user is what Spring Boot uses to connect, this guarantees
-- the backend will NEVER be locked out, even when routed through PgBouncer.

CREATE POLICY "backend_bypass_app_audit_logs" ON public.app_audit_logs FOR ALL TO postgres USING (true) WITH CHECK (true);
CREATE POLICY "backend_bypass_bank_accounts" ON public.bank_accounts FOR ALL TO postgres USING (true) WITH CHECK (true);
CREATE POLICY "backend_bypass_bills" ON public.bills FOR ALL TO postgres USING (true) WITH CHECK (true);
CREATE POLICY "backend_bypass_budgets" ON public.budgets FOR ALL TO postgres USING (true) WITH CHECK (true);
CREATE POLICY "backend_bypass_categories" ON public.categories FOR ALL TO postgres USING (true) WITH CHECK (true);
CREATE POLICY "backend_bypass_comments" ON public.comments FOR ALL TO postgres USING (true) WITH CHECK (true);
CREATE POLICY "backend_bypass_debts" ON public.debts FOR ALL TO postgres USING (true) WITH CHECK (true);
CREATE POLICY "backend_bypass_investments" ON public.investments FOR ALL TO postgres USING (true) WITH CHECK (true);
CREATE POLICY "backend_bypass_likes" ON public.likes FOR ALL TO postgres USING (true) WITH CHECK (true);
CREATE POLICY "backend_bypass_notifications" ON public.notifications FOR ALL TO postgres USING (true) WITH CHECK (true);
CREATE POLICY "backend_bypass_posts" ON public.posts FOR ALL TO postgres USING (true) WITH CHECK (true);
CREATE POLICY "backend_bypass_recurring_transactions" ON public.recurring_transactions FOR ALL TO postgres USING (true) WITH CHECK (true);
CREATE POLICY "backend_bypass_refresh_tokens_v2" ON public.refresh_tokens_v2 FOR ALL TO postgres USING (true) WITH CHECK (true);
CREATE POLICY "backend_bypass_retirement_accounts" ON public.retirement_accounts FOR ALL TO postgres USING (true) WITH CHECK (true);
CREATE POLICY "backend_bypass_savings_goals" ON public.savings_goals FOR ALL TO postgres USING (true) WITH CHECK (true);
CREATE POLICY "backend_bypass_scheduled_reports" ON public.scheduled_reports FOR ALL TO postgres USING (true) WITH CHECK (true);
CREATE POLICY "backend_bypass_transactions" ON public.transactions FOR ALL TO postgres USING (true) WITH CHECK (true);
CREATE POLICY "backend_bypass_user_profiles" ON public.user_profiles FOR ALL TO postgres USING (true) WITH CHECK (true);
CREATE POLICY "backend_bypass_users" ON public.users FOR ALL TO postgres USING (true) WITH CHECK (true);
CREATE POLICY "backend_bypass_password_reset_tokens" ON public.password_reset_tokens FOR ALL TO postgres USING (true) WITH CHECK (true);
