# Backend administrativo

O Supabase é o backend de dados da Noite de Jogos. Esta pasta contém apenas
operações privilegiadas de manutenção e diagnóstico que nunca devem ser
executadas no navegador ou incluídas no aplicativo iOS.

## Responsabilidades

- verificar a integridade do catálogo no Supabase;
- importar e administrar conteúdo no futuro;
- executar rotinas que dependam da chave secreta;
- hospedar regras privilegiadas caso elas não caibam em uma Edge Function.

O site e o app iOS devem usar somente a chave `publishable`, com acesso
limitado pelas políticas de Row Level Security em `supabase/migrations/`.

## Configuração local

Requer Node.js 22 ou mais recente.

```bash
cd backend
npm install
cp .env.example .env
```

Preencha em `.env`:

```dotenv
SUPABASE_URL=https://SEU-PROJECT-REF.supabase.co
SUPABASE_SECRET_KEY=sb_secret_REPLACE_ME
```

O arquivo `.env` está ignorado pelo Git. Nunca coloque a chave secreta em
arquivos do frontend, commits, screenshots ou mensagens.

## Comandos

```bash
npm test
npm run catalog:health
```

`catalog:health` consulta as sete tabelas de catálogo e lista os jogos ativos.
Ele não altera dados.

## Estrutura

```text
backend/
  src/
    cli/                  comandos administrativos
    config/               validação do ambiente
    modules/
      catalog/            acesso ao catálogo
    shared/
      supabase/           cliente privilegiado centralizado
  test/                   testes do backend
```
