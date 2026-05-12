-- Add category foreign key to questions

alter table public.questions
add column if not exists category_id uuid;

alter table public.questions
add constraint if not exists questions_category_fk
foreign key (category_id)
references public.categories(id)
on delete cascade;
