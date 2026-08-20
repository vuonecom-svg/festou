-- Locação por período: nº de diárias no orçamento (aditivo, default 1).
alter table orcamento add column if not exists diarias int not null default 1;
