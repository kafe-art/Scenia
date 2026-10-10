-- Datos de prueba (Seeds) para desarrollo y testing

INSERT INTO users (id, email, username, hashed_password, is_active)
VALUES 
  ('usr-001', 'admin@scenia.local', 'admin', '$2b$12$e80yVv66WvH.p0fF7kQz.evHhP9g5gP5t1sR/0W9Q4K5n1.w2bB2u', 1),
  ('usr-002', 'testuser@scenia.local', 'testuser', '$2b$12$e80yVv66WvH.p0fF7kQz.evHhP9g5gP5t1sR/0W9Q4K5n1.w2bB2u', 1)
ON CONFLICT (email) DO NOTHING;

INSERT INTO items (id, title, description, owner_id)
VALUES
  ('itm-001', 'Primer Elemento de Prueba', 'Descripción del primer elemento para testing en Scenia.', 'usr-001'),
  ('itm-002', 'Segundo Elemento de Prueba', 'Descripción de un elemento secundario para pruebas de UI y endpoints.', 'usr-002')
ON CONFLICT (id) DO NOTHING;
