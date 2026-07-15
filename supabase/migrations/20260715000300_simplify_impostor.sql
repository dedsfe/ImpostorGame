-- Align Supabase metadata and tutorials with the simplified Impostor flow.

begin;

update public.games
set supports_difficulties = false
where slug = 'impostor';

update public.game_tutorials
set copy = 'Escolha jogadores e tema, distribua os papéis e só revele o resultado depois de encerrar a rodada.'
where game_id = (select id from public.games where slug = 'impostor');

update public.tutorial_steps
set
  title = case step_order
    when 1 then 'Prepare o jogo'
    when 2 then 'Vejam e passem'
    when 3 then 'Joguem e encerrem'
    else title
  end,
  copy = case step_order
    when 1 then 'Escolha jogadores e tema. O baralho evita repetições até completar o tema.'
    when 2 then 'Cada pessoa toca em Ver meu papel e depois em Ocultar e passar.'
    when 3 then 'Depois do Valendo!, conversem e encerrem a rodada para revelar o resultado.'
    else copy
  end
where tutorial_id = (
  select id
  from public.game_tutorials
  where game_id = (select id from public.games where slug = 'impostor')
);

commit;
