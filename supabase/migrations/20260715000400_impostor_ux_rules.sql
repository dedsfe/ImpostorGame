-- Keep the remote tutorial aligned with the first Impostor UX review.

begin;

update public.games
set description = 'O impostor conhece apenas o tema e precisa blefar enquanto o grupo dá pistas.'
where slug = 'impostor';

update public.game_tutorials
set
  title = 'Como jogar Impostor',
  copy = 'Jogadores comuns conhecem a palavra secreta. Impostores conhecem apenas o tema. Ninguém pode falar diretamente a palavra secreta.'
where game_id = (select id from public.games where slug = 'impostor');

update public.role_templates
set
  title = case slug
    when 'impostor' then 'Você é o impostor'
    when 'word-holder' then 'Sua palavra secreta é'
    else title
  end,
  description = case slug
    when 'impostor' then 'Escute as pistas, tente descobrir a palavra secreta e não entregue que você não a conhece.'
    when 'word-holder' then 'Guarde a palavra secreta e pense em uma pista que não seja óbvia.'
    else description
  end
where game_id = (select id from public.games where slug = 'impostor');

delete from public.tutorial_steps
where tutorial_id = (
  select id
  from public.game_tutorials
  where game_id = (select id from public.games where slug = 'impostor')
);

insert into public.tutorial_steps (tutorial_id, step_order, title, copy)
select tutorial.id, step.step_order, step.title, step.copy
from public.game_tutorials as tutorial
join public.games as game on game.id = tutorial.game_id
cross join (
  values
    (1, 'Configure a rodada', 'Configure jogadores e tema.'),
    (2, 'Distribua os papéis', 'Passe o celular para cada pessoa ver somente o próprio papel.'),
    (3, 'Dê uma pista', 'Cada jogador dá uma pista curta sem falar diretamente a palavra secreta.'),
    (4, 'Conversem', 'O grupo conversa sobre as pistas e observa quem parece suspeito.'),
    (5, 'Escolham os suspeitos', 'O grupo deve escolher a mesma quantidade de suspeitos que o número de impostores.'),
    (6, 'Revelem o resultado', 'Se o grupo encontrar todos os impostores, eles recebem uma tentativa conjunta de adivinhar a palavra. Se acertarem, os impostores roubam a vitória. Se algum impostor passar despercebido, os impostores vencem.')
) as step(step_order, title, copy)
where game.slug = 'impostor';

commit;
