/*
postgres
*/


-- ----------------------------
-- Table structure for fb_users
-- ----------------------------
DROP TABLE IF EXISTS "public"."fb_users";
CREATE TABLE "public"."fb_users" (
  "id" uuid NOT NULL,
  "username" varchar(255) COLLATE "pg_catalog"."default",
  "password" text COLLATE "pg_catalog"."default",
  "email" varchar(255) COLLATE "pg_catalog"."default",
  "created_at" date,
  "password2" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Primary Key structure for table fb_users
-- ----------------------------
ALTER TABLE "public"."fb_users" ADD CONSTRAINT "users_copy1_pkey" PRIMARY KEY ("id");

/*
mysql
*/


DROP TABLE fb_users;
CREATE TABLE fb_users (
  id text,
  username varchar(255) ,
  password text ,
  email varchar(255) ,
  created_at date,
  password2 text 
);
