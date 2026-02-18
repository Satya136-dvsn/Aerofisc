-- Security Hardening: Enable RLS on all public tables
-- This blocks all access via the PostgREST API (Supabase Client) while allowing the backend (postgres user) to continue working.

-- 1. app_audit_logs
ALTER TABLE public.app_audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. bank_accounts
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

-- 3. bills
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

-- 4. budgets
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- 5. categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 6. comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 7. debts
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

-- 8. investments
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- 9. likes
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- 10. notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 11. posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 12. recurring_transactions
ALTER TABLE public.recurring_transactions ENABLE ROW LEVEL SECURITY;

-- 13. scheduled_reports
ALTER TABLE public.scheduled_reports ENABLE ROW LEVEL SECURITY;

-- 14. retirement_accounts
ALTER TABLE public.retirement_accounts ENABLE ROW LEVEL SECURITY;

-- 15. savings_goals
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;

-- 16. refresh_tokens_v2
ALTER TABLE public.refresh_tokens_v2 ENABLE ROW LEVEL SECURITY;

-- 17. transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 18. users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
