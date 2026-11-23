-- =====================================================================
-- TORNAR O ADMINISTRADOR
-- Rode DEPOIS de criar a sua conta no site (aba "Cadastrar").
-- O administrador pode excluir qualquer anúncio ou categoria.
-- Só dá para virar administrador por aqui (SQL Editor), nunca pelo site.
-- =====================================================================

update public.profiles set is_admin = true where zap = '34991483936';

-- Confira: deve aparecer o nome Rafael com is_admin = true
select nome, zap, is_admin from public.profiles where zap = '34991483936';
