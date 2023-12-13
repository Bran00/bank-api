# Banco da Gente API

A Banco da Gente API é uma aplicação construída usando NestJS para simular operações bancárias simples. Ela utiliza MongoDB como banco de dados, JWT para autenticação, Swagger para documentação da API, e outras tecnologias modernas.

## Assista aqui como usar a API

[Link para o vídeo](https://www.loom.com/share/122fe3f633a74e1b98eebb2639c6cf84?sid=2a04b6a5-102c-429e-b863-0a36e3b01090)

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [JWT](https://jwt.io/)
- [Swagger](https://swagger.io/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [Jest](https://jestjs.io/)

## Instalação

Certifique-se de ter o Node.js e o npm instalados. Execute o seguinte comando para instalar as dependências:

```bash
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto e configure as variáveis de ambiente necessárias. Veja um exemplo:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bank(Aqui recomendo o uso de um cluster do MONGODB)
JWT_SECRET=seusegredojwt
# Adicione outras variáveis de ambiente conforme necessário
```

## Uso

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run start:dev
```

O servidor estará acessível em `http://localhost:3000` por padrão.

## Testes

Execute os testes automatizados:

```bash
npm test
```

## Documentação API

A documentação da API está disponível em `http://localhost:3000/api`.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir problemas (issues) e pull requests.

## Licença

Este projeto é licenciado sob a licença MIT.
