begin;

grant usage on schema public to anon, authenticated;

grant select on table
  profile,
  experience,
  education,
  skill,
  project,
  service,
  article,
  social,
  award,
  testimonial
to anon, authenticated;

alter table profile enable row level security;
drop policy if exists profile_public_read on profile;
create policy profile_public_read on profile for select using (true);

alter table experience enable row level security;
drop policy if exists experience_public_read on experience;
create policy experience_public_read on experience for select using (true);

alter table education enable row level security;
drop policy if exists education_public_read on education;
create policy education_public_read on education for select using (true);

alter table skill enable row level security;
drop policy if exists skill_public_read on skill;
create policy skill_public_read on skill for select using (true);

alter table project enable row level security;
drop policy if exists project_public_read on project;
create policy project_public_read on project for select using (true);

alter table service enable row level security;
drop policy if exists service_public_read on service;
create policy service_public_read on service for select using (true);

alter table social enable row level security;
drop policy if exists social_public_read on social;
create policy social_public_read on social for select using (true);

alter table award enable row level security;
drop policy if exists award_public_read on award;
create policy award_public_read on award for select using (true);

alter table testimonial enable row level security;
drop policy if exists testimonial_public_read on testimonial;
create policy testimonial_public_read on testimonial for select using (true);

alter table article enable row level security;
drop policy if exists article_public_read on article;
create policy article_public_read on article for select using (published = true);

commit;

