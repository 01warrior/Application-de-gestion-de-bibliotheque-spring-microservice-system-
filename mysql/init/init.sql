CREATE DATABASE IF NOT EXISTS bibliotheque_books;
CREATE DATABASE IF NOT EXISTS bibliotheque_users;
CREATE DATABASE IF NOT EXISTS bibliotheque_emprunts;
-- Optionnel: attribuer les droits au user 'root' (root existe déjà)
-- GRANT ALL PRIVILEGES ON bibliotheque_books.* TO 'root'@'%';
-- FLUSH PRIVILEGES;