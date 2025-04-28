# GigaBoard

[Descrição foda aqui]

## Como rodar localmente

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

    `API_KEY` — É a chave de API para administradores. Pode ser gerada neste [site](https://generate-random.org/api-key-generator?length=256). Trate com segurança.

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

## Como iniciar os testes e configurar o Cypress

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

## Observações

* Certifique-se de que o servidor (`ts-node server.ts`) esteja rodando antes de executar os testes end-to-end.
* O Cypress utilizará o `baseUrl` configurado para realizar os testes automaticamente.
