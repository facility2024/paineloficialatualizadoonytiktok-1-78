-- Atualizar o usuário para ter role de admin
UPDATE auth.users 
SET raw_user_meta_data = '{"role": "admin"}'::jsonb
WHERE email = 'otaviogcasartelli@gmail.com';