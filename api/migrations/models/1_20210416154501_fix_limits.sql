-- upgrade --
ALTER TABLE "ficheaction" ALTER COLUMN "budget" TYPE DOUBLE PRECISION USING "budget"::DOUBLE PRECISION;
ALTER TABLE "ficheaction" ALTER COLUMN "titre" TYPE VARCHAR(300) USING "titre"::VARCHAR(300);
-- downgrade --
ALTER TABLE "ficheaction" ALTER COLUMN "budget" TYPE SMALLINT USING "budget"::SMALLINT;
ALTER TABLE "ficheaction" ALTER COLUMN "titre" TYPE VARCHAR(100) USING "titre"::VARCHAR(100);
