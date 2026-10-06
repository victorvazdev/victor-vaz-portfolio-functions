# victor-vaz-portfolio-functions

Cloud Functions do portfólio [victorvaz.dev](https://victorvaz.dev), no projeto Firebase `victor-vaz`.
Antes este código ficava em `functions/` do [portfólio antigo em Flutter](https://github.com/victorvazdev/victor_vaz_portfolio).
O frontend atual fica em [victor-vaz-portfolio](https://github.com/victorvazdev/victor-vaz-portfolio).

Exporta uma única função HTTP, `api` (Express, 2ª geração, `us-central1`):

| Rota | Descrição |
| --- | --- |
| `POST /send-email` | Recebe `{name, email, message}` do formulário de contato e envia via [Resend](https://resend.com). |

URL atual: `https://api-cjay4kdwqq-uc.a.run.app`

## Configuração

Os dados do e-mail (API key do Resend, remetente e destinatário) ficam no `.env`, que não é versionado mas vai junto no deploy.
Copie o modelo `.env.example` e preencha as variáveis:

```sh
cp .env.example .env
```

## Rodando

```sh
npm install
npm run lint
npm run serve    # emulador local
npm run deploy   # firebase deploy --only functions
npm run logs
```

## Testes

```sh
npm test                  # unitários (Resend simulado, não envia e-mail)
npm run test:integration  # envia um e-mail real pelo Resend usando o .env
```

## Estrutura

```
index.js                 declara e exporta as functions (api)
src/
  config.js              lê o .env (único lugar que acessa process.env)
  app.js                 app Express: CORS e montagem das rotas
  routes/contact.js      POST /send-email: validação e resposta HTTP
  services/mailer.js     envio do e-mail via Resend
test/
  unit/                  testes da rota e do mailer
  integration/           envio real pelo Resend
```

Para uma nova rota, crie um arquivo em `src/routes/` e monte-o em `src/app.js`;
integrações externas ficam em `src/services/`.
