# Email List

## SOBRE

Esse projeto tem o objetivo extrair uma lista de emails para email marketing a partir dos métodos de busca da API do gmail.
Utilizando palavras chaves, data ou qualquer método fornecido pela API ele filtra as mensagens e exporta em um arquivo .csv

## TECNOLOGIAS

 - Node.Js
 - fast-csv
 - googleapis

# Instalação

```bash
npm install
# or
yarn install
```

# configuração

1 - O primeiro passo é criar as credenciais no Google Cloud como está descrito na documentação da API no link abaixo. 
[link para configuração das crendenciais](https://developers.google.com/gmail/api/quickstart/nodejs?hl=pt-br)

2- na linha 95 do arquivo index.js configurar os paramentos para busca. Que é Compatível com o mesmo formato de consulta da caixa de pesquisa do Gmail

    ```
        q: "palavra para busca after:2022/01/01 before:2023/06/12",
    ```

3 - Na Primeira vez que o usuário rodar o comando “node .” no prompt comando, irá abrir uma tela do navegador solicitando login em uma conta gmail.

4 - Após rodar o comando e fazer a autenticação a aplicação irá criar o arquivo .csv na pasta /emailList com o resultado da pesquisa. 



