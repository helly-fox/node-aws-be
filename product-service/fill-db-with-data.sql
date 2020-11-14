create extension if not exists 'uuid-ossp';

create table products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
  image text,
	price integer
);

create table stocks (
	product_id uuid,
	count integer,
	foreign key ("product_id") references "products" ("id")
);

insert into products (id, title, description, price, image) values
('7567ec4b-b10c-48c5-9345-fc73c48a80aa', '6.5 Balsam Hill Blue Spruce Artificial Christmas Tree Unlit', 'The Classic Blue Spruce branches tips and shape echo the nuanced color variations and shape of the Colorado Blue Spruce. Its light gray, blue-green, and moss green needles are complemented by sturdy branches in a brown hue.', 199, 'https://images-na.ssl-images-amazon.com/images/I/91wWMMIPt-L._AC_SX522_.jpg'),
('7567ec4b-b10c-48c5-9345-fc73c48a80a0', 'Jersey Fraser Fir - 7.5 ft', 'This tree uses our trademarked "FEEL REAL" technology that offers outstanding realism on 3,144 branch tips. These crush-resistant tips give our trees and greenery foliage that best mirrors nature design.', 500, 'https://images-na.ssl-images-amazon.com/images/I/91aH4GQzu1L._AC_SX679_.jpg'),
('7567ec4b-b10c-48c5-9345-fc73c48a80a2','Tiffany Fir Slim - 7.5 ft', 'This tree uses our trademarked "FEEL REAL" technology that offers outstanding realism on 1,878 pre-lit branch tips These crush-resistant tips give our trees and greenery foliage that best mirrors nature`s design', 200, 'https://images-na.ssl-images-amazon.com/images/I/91VvM4Jf7jL._AC_SX679_.jpg'),
('7567ec4b-b10c-48c5-9345-fc73c48a80a1','Feel Real Red Berry Tree with Snow Flocked 4.5FT', 'Standing at 4.5FT tall.38 inches wide; with 29pcs Red Berry;FULL BRANCHES: Hundreds of branch tips create a full appearance ;Number of Tips (5ft/6ft/7ft): 460 / 965 / 1220', 89, 'https://images-na.ssl-images-amazon.com/images/I/81oMuVoa4uL._AC_SX679_.jpg'),
('7567ec4b-b10c-48c5-9345-fc73c48a80a3','PVC Crystal White', 'Beautifully crafted with 1150 PVC tips; Built with hinged branches for easy storage; Includes heavy duty metal stand', 168, 'https://images-na.ssl-images-amazon.com/images/I/51DAwJkxzjL._AC_.jpg'),
('7567ec4b-b10c-48c5-9345-fc73c48a80a4','Kincaid Spruce - 4 ft', 'Our artificial branches look ultra-realistic and lifelike With 269 individually crafted branch tips, this full bodied tree is as charming as the real thing', 49,'https://images-na.ssl-images-amazon.com/images/I/81QocsrAZrL._AC_SX679_.jpg'),
('7567ec4b-b10c-48c5-9345-fc73c48a80a5','Prelighted Xmas Tree with Foldable Stand (7.5ft, White)', 'Snow Dusted Full Look: Speaking of highlights On Christmas Eve., a frosted Christmas tree must be on the top list. This pre-lit artificial tree are all green pvc leaves covered with white flocking, these numerous branch tips dusted with thick full “snow” give a soft fluffy appearance and definitely makes the tree lifelike. Nicely scattered lights are in clear warm tone, transferring coziness and happiness to your room through the whole holidays.', 230, 'https://images-na.ssl-images-amazon.com/images/I/81eBnPzHSuL._AC_SX679_.jpg'),
('7567ec4b-b10c-48c5-9345-fc73c48a80a6','Kingswood Fir Pencil, 6 ft, 6 Ft', 'Our artificial branches look ultra-realistic and lifelike. With 629 individually crafted branch tips, this full bodied tree is as charming as the real thing.', 63, 'https://images-na.ssl-images-amazon.com/images/I/910CY89noAL._AC_SX679_.jpg');

insert into stocks (product_id, count) values
('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 4),
('7567ec4b-b10c-48c5-9345-fc73c48a80a0', 6),
('7567ec4b-b10c-48c5-9345-fc73c48a80a2', 7),
('7567ec4b-b10c-48c5-9345-fc73c48a80a1', 12),
('7567ec4b-b10c-48c5-9345-fc73c48a80a3', 7),
('7567ec4b-b10c-48c5-9345-fc73c48a80a4', 8),
('7567ec4b-b10c-48c5-9345-fc73c48a80a5', 2),
('7567ec4b-b10c-48c5-9345-fc73c48a80a6', 3);
