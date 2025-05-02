# GigaBoard 🚀

GigaBoard é um aplicativo simples de lista de tarefas projetado para facilitar os testes com Cypress e Postman. Ele fornece uma API direta e um front-end mínimo, tornando-o ideal para praticar automação de testes. 🧪

## Tecnologias Utilizadas 🛠️

-   **Backend:**
    -   Node.js  (Precisa instalar, verifique sua versão 🔍)
    -   Express `^5.1.0` 
    -   SQLite `^5.1.7` (para simplicidade 🗄️)
    -   Sequelize `^6.37.7` (ORM 🔗)
    -   `express-basic-auth` `^1.2.1` (para autenticação básica - pode ser usado em testes 🔑)
    -   `body-parser` `^2.2.0`, `cookie-parser` `^1.4.7` 🍪
-   **Frontend:**
    -   React `^19.1.0` ⚛️
    -   React DOM `^19.1.0` 
    -   `js-cookie` `^3.0.5` 🍪
-   **Build/Ferramentas:**
    -   TypeScript  (Precisa instalar, verifique sua versão ⌨️)
    -   Gulp `^5.0.0`, Browserify `^17.0.1`, `factor-bundle` `^2.5.0`, `tsify` `^5.0.4`, `watchify` `^4.0.0` ⚙️
    -   dotenv `^16.5.0` 🔑
-   **Testes:**
    -   Cypress  (Você adicionará - instale com `npm install cypress --save-dev` 🧪)
    -   Postman  (Para testes de API 📬)

## Funcionalidades ✨

-   Registro e autenticação de usuários 🧑‍💻
-   Gerenciamento básico de tarefas To-Do ✅
-   Endpoints de API para criação, recuperação e atualização de tarefas 🌐
-   Construído com testes em mente, fácil de automatizar 🤖

## Como rodar localmente 🏃

Um tutorial rápido de como rodar o GigaBoard localmente para o desenvolvimento:

1.  **Instale as bibliotecas:**

    ```bash
    npm install
    ```

2.  **Instale as ferramentas Gulp e ts-node globalmente:**

    ```bash
    npm install -g gulp-cli ts-node
    ```

3.  **Crie o arquivo `.env` com a seguinte variável:**

    `API_KEY` — É a chave de API para administradores. Pode ser gerada neste [site](https://generate-random.org/api-key-generator?length=256). Trate com segurança. 🔒

    **Exemplo de arquivo `.env`:**

    ```ini
    API_KEY=[Chave API gerada por você]
    ```

4.  **Gere os scripts do navegador:**

    ```bash
    gulp build
    ```

    ou, para desenvolvimento contínuo:

    ```bash
    gulp watch
    ```

5.  **Rode o servidor:**

    ```bash
    ts-node server.ts
    ```

## API Endpoints 🌐

\*Todos os endpoints esperam e retornam JSON, a menos que especificado de outra forma.\*

### Registro ✍️

-   **Endpoint:** `/api/register`
-   **Método:** POST
-   **Corpo:**

    ```json
    {
      "name": "João da Silva",
      "email": "joao.silva@exemplo.com",
      "password": "senhaSegura123"
    }
    ```

-   **Resposta de Sucesso (200):** Retorna um token (como um buffer, você provavelmente precisará converter isso em seus testes)

    \*Importante: A resposta real é um buffer bruto. No Postman/seus testes, você precisará manipular isso para extrair a string do token (parece que o código usa `Buffer.from(await res.arrayBuffer()).toString('base64');` para convertê-lo).\*

-   **Respostas de Erro:**
    -   (Adicione respostas de erro específicas se você as tiver, por exemplo, 409 para e-mail já existente)

### Login 🔑

-   **Endpoint:** `/api/login`
-   **Método:** POST
-   **Corpo:**

    ```json
    {
      "email": "joao.silva@exemplo.com",
      "password": "senhaSegura123"
    }
    ```

-   **Resposta de Sucesso (200):** Retorna um token (novamente, como um buffer).

    \*Importante: Mesma observação acima sobre como lidar com a resposta do buffer.\*

-   **Respostas de Erro:**
    -   409: Credenciais inválidas

### Logout 🚪

-   **Endpoint:** `/api/logout`
-   **Método:** POST
-   **Corpo:**

    ```json
    {
      "token": "o_token_do_usuario_aqui"  //  \*Codificado em Base64\*
    }
    ```

-   **Resposta de Sucesso (200):** Indica logout bem-sucedido.
-   **Respostas de Erro:** (Adicione se houver alguma)

### Consulta (Admin - Use com Cautela!) ⚠️

-   **Endpoint:** `/api/query`
-   **Método:** POST
-   **Corpo:**

    ```json
    {
      "key": "SUA_CHAVE_DE_API",  //  \*Importante: Obtenha isso do seu arquivo .env!\*
      "query": "String de consulta SQL"  //  \*Exemplo: SELECT \* FROM Users; Use com extremo cuidado!\*
    }
    ```

-   **Resposta de Sucesso (200):** Retorna o resultado da consulta SQL.

    \*AVISO: Este endpoint permite consultas diretas ao banco de dados. É MUITO importante protegê-lo com uma chave de API forte e usá-lo com responsabilidade, principalmente para testes ou tarefas administrativas. Sanitize as entradas cuidadosamente para evitar vulnerabilidades de injeção de SQL!\*

-   **Respostas de Erro:**
    -   401: Chave de API inválida

### Atualização de Tarefas (Exemplo - Adapte Conforme Necessário) 📝

-   **Endpoint:** `/api/updatetasks` (Isso é de `server.ts`, ajuste se seus endpoints de tarefa reais forem diferentes)
-   **Método:** POST (ou PUT/PATCH, conforme apropriado)
-   **Corpo:** (Defina a estrutura para atualizar tarefas - por exemplo:)

    ```json
    {
      "taskId": 123,
      "description": "Descrição da tarefa atualizada",
      "completed": true
    }
    ```

-   **Resposta de Sucesso (200):** Indica atualização bem-sucedida. (Pode retornar os dados da tarefa atualizada)
-   **Respostas de Erro:**
    -   401: Não autorizado (se o usuário não estiver autenticado)
    -   404: Tarefa não encontrada

## Como iniciar os testes e configurar o Cypress 🧪

1.  **Instale o Cypress como dependência de desenvolvimento:**

    ```bash
    npm install cypress --save-dev
    ```

2.  **Para abrir a interface gráfica do Cypress e rodar os testes:**

    ```bash
    npx cypress open
    ```

3.  **Para rodar os testes diretamente no terminal (modo headless):**

    ```bash
    npx cypress run
    ```

4.  **Verifique se o arquivo `cypress.config.ts` está corretamente configurado para o seu ambiente, ajustando caminhos de `e2e.specPattern`, `baseUrl` e outros parâmetros conforme necessário.**

## Observações 💡

-   Certifique-se de que o servidor (`ts-node server.ts`) esteja rodando antes de executar os testes end-to-end. 🏃‍♂️
-   O Cypress utilizará o `baseUrl` configurado para realizar os testes automaticamente. 🤖


## Considerações Importantes ⚠️

-   **Segurança:** Este aplicativo é para fins de teste. Em um ambiente de produção, você precisaria implementar medidas de segurança robustas:
    -   Hashing de senha (o código usa `pbkdf2Sync`, o que é bom, mas garanta a geração adequada de salt)
    -   Validação e sanitização de entrada (ESPECIALMENTE para o endpoint `/api/query` para evitar injeção de SQL)
    -   HTTPS 🔒
    -   Gerenciamento adequado de sessão (o código fornecido usa um simples `BufferMap` na memória, o que NÃO é adequado para produção)
    -   Configuração de CORS
-   **Tratamento de Erros:** O código fornecido inclui respostas de erro básicas, mas você pode querer expandi-las para um aplicativo pronto para produção. 🐛
-   **Banco de Dados:** SQLite é usado para simplicidade. Para aplicativos maiores, considere um sistema de banco de dados mais robusto (PostgreSQL, MySQL, etc.). 🗄️
-   **Chave de API:** A `API_KEY` para o endpoint `/api/query` NUNCA deve ser exposta no código do lado do cliente. Sempre armazene-a com segurança em variáveis de ambiente. 🔑
-   **Manipulação de Token:** O token está sendo enviado atualmente como um Buffer. Você provavelmente vai querer padronizar isso como uma string (por exemplo, um JWT) em um aplicativo real. 🎫

## Autores 🤝

[Marcelo Plinio](https://github.com/MarceloPlinio), [Richard Vinicys](https://github.com/RichardVinicys), [Igor Ferreira](https://github.com/Igor-Lob), [Arthur Figueiredo](https://github.com/Memz-idk), [Ester tavares](https://github.com/estervit) e Carlos Eduardo

## Licença 📜

Todos os direitos reservado por GigaBoard
