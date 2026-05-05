"# aqua" 

docker exec -it aqua-postgres psql -U postgres -d aqua_db

aqua_db=# \d
aqua_db=# \q

aqua_db=# select * from "Tenant";
aqua_db=# UPDATE "Tenant" SET "planId" = 3 WHERE id = 4;
aqua_db=# UPDATE "Tenant" SET "planId" = NULL WHERE id = 4;
