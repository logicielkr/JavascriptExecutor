CREATE SCHEMA javascript;
ALTER TABLE javascript SET SCHEMA javascript;
ALTER TABLE javascript_history SET SCHEMA javascript;
alter SEQUENCE "javascript$javascript_id" SET SCHEMA javascript;
alter SEQUENCE "javascript_history$javascript_history_id" SET SCHEMA javascript;
alter table javascript.javascript alter column javascript_id set default nextval('javascript.javascript$javascript_id'::regclass);
alter table javascript.javascript_history alter column javascript_history_id set default nextval('javascript.javascript_history$javascript_history_id'::regclass);

