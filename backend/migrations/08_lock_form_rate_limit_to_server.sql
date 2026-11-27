-- Only the server (secret key / service_role) may call the form rate limiter.
-- With the public key anyone could insert rows directly or pre-fill another sender's limit.
REVOKE EXECUTE ON FUNCTION public.check_form_rate_limit(TEXT, TEXT, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_form_rate_limit(TEXT, TEXT, INTEGER, INTEGER) TO service_role;
