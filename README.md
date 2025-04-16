# GigaBoard
[Descrição foda aqui]

## Como rodar localmente:
Um tutorial rápido de como rodar o GigaBoard localmente para o desenvolvimento:
1. Instale as bibliotecas com `npm i`
2. Instale a ferramenta Gulp com o comando `npm i -g gulp-cli`
3. Adicione os seguintes valores ao arquivo .env ou as variáveis locais:
    1. API_KEY - É a chave de API para administradores, pode ser gerada [nesse site](https://generate-random.org/api-key-generator?length=256), tratar com segurança.

    Um exemplo de um arquivo .env seria:
    ```
    API_KEY=[Chave API gerada por você]
    ```
4. Gere os scripts do navegador com `gulp build` ou `gulp watch`
5. Rode o servidor com `node server.js`