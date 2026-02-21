begin;

grant insert on table message to anon, authenticated;

alter table message enable row level security;
drop policy if exists message_public_insert on message;
create policy message_public_insert on message for insert with check (true);

commit;

