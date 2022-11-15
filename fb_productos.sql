/*
postgres
*/


-- ----------------------------
-- Table structure for fb_productos
-- ----------------------------
DROP TABLE IF EXISTS "public"."fb_productos";
CREATE TABLE "public"."fb_productos" (
  "id" uuid NOT NULL,
  "id_user" uuid,
  "barcode" text COLLATE "pg_catalog"."default",
  "descripcion" varchar(255) COLLATE "pg_catalog"."default",
  "valor" float8,
  "created_at" timestamp(0)
)
;

-- ----------------------------
-- Primary Key structure for table fb_productos
-- ----------------------------
ALTER TABLE "public"."fb_productos" ADD CONSTRAINT "productos_copy1_pkey" PRIMARY KEY ("id");

/*
mysql
*/

CREATE TABLE fb_productos (
  id text,
  id_user text,
  barcode text,
  descripcion varchar(255),
  valor float,
  created_at TIMESTAMP
);