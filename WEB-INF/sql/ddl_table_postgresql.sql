CREATE SCHEMA javascript;

CREATE SEQUENCE javascript."javascript$javascript_id"; 

create table javascript.javascript (
	javascript_id integer NOT NULL DEFAULT nextval('javascript.javascript$javascript_id'::regclass),
	title varchar(1000),
	source text,
	contents text,
	results text,
	encrypted bool,
	parent_id integer,
	insert_date timestamp,
	insert_id varchar(50),
	insert_ip varchar(15),
	update_date timestamp,
	update_id varchar(50),
	update_ip varchar(15),
	PRIMARY KEY (javascript_id)
);

/**
like 검색 성능 향상
*/
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "javascript$title" ON javascript.javascript USING gin (title gin_trgm_ops);
CREATE INDEX "javascript$contents" ON javascript.javascript USING gin (contents gin_trgm_ops);

comment on table javascript.javascript is 'Javascript 실행기';

COMMENT ON COLUMN javascript.javascript.javascript_id IS '고유번호';
COMMENT ON COLUMN javascript.javascript.title IS '제목';
COMMENT ON COLUMN javascript.javascript.source IS '소스';
COMMENT ON COLUMN javascript.javascript.contents IS '내용';
COMMENT ON COLUMN javascript.javascript.results IS '실행결과';
COMMENT ON COLUMN javascript.javascript.encrypted IS '암호화';
COMMENT ON COLUMN javascript.javascript.parent_id IS '상위 Javascript 실행기 고유번호';
COMMENT ON COLUMN javascript.javascript.insert_date IS '최초입력일시';
COMMENT ON COLUMN javascript.javascript.insert_id IS '최초입력자ID';
COMMENT ON COLUMN javascript.javascript.insert_ip IS '최초입력자IP';
COMMENT ON COLUMN javascript.javascript.update_date IS '최종수정일시';
COMMENT ON COLUMN javascript.javascript.update_id IS '최종수정자ID';
COMMENT ON COLUMN javascript.javascript.update_ip IS '최종수정자IP';

CREATE SEQUENCE javascript."javascript_history$javascript_history_id";

create table javascript.javascript_history (
	javascript_history_id integer NOT NULL DEFAULT nextval('javascript.javascript_history$javascript_history_id'::regclass),
	title varchar(1000),
	source text,
	contents text,
	results text,
	encrypted bool,
	parent_id integer,
	javascript_id integer,
	autosave bool,
	insert_date timestamp,
	insert_id varchar(50),
	insert_ip varchar(15),
	update_date timestamp,                   
	update_id varchar(50),
	update_ip varchar(15),
	PRIMARY KEY (javascript_history_id)
);

comment on table javascript.javascript_history is 'Javascript 실행기 이력관리';

COMMENT ON COLUMN javascript.javascript_history.javascript_history_id IS '고유번호';
COMMENT ON COLUMN javascript.javascript_history.title IS '제목';
COMMENT ON COLUMN javascript.javascript_history.source IS '소스';
COMMENT ON COLUMN javascript.javascript_history.contents IS '내용';
COMMENT ON COLUMN javascript.javascript_history.results IS '실행결과';
COMMENT ON COLUMN javascript.javascript_history.encrypted IS '암호화';
COMMENT ON COLUMN javascript.javascript_history.parent_id IS '상위 Javascript 실행기 고유번호';
COMMENT ON COLUMN javascript.javascript_history.javascript_id IS 'Javascript 실행기 ID';
COMMENT ON COLUMN javascript.javascript_history.autosave IS '자동저장';
COMMENT ON COLUMN javascript.javascript_history.insert_date IS '최초입력일시';
COMMENT ON COLUMN javascript.javascript_history.insert_id IS '최초입력자ID';
COMMENT ON COLUMN javascript.javascript_history.insert_ip IS '최초입력자IP';
COMMENT ON COLUMN javascript.javascript_history.update_date IS '최종수정일시';
COMMENT ON COLUMN javascript.javascript_history.update_id IS '최종수정자ID';
COMMENT ON COLUMN javascript.javascript_history.update_ip IS '최종수정자IP';

