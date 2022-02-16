## Sobre
Este projeto surgiu como um fork com o objetivo de adaptar uma plataforma de RPG com um sistema personalizado.

## Instalação
- Clone o projeto na sua maquina, ou baixe o zip.
- Executar `npm install` para instalar as dependencias
- Criar um banco de dados local e configurar a varivel DB_PROVIDER_URL apontando para este banco
- Executar `npx prisma migrate reset` para fazer as migrações no banco
- Executar `npm start` para iniciar

### Tecnologias sendo utilizadas
- Next.JS com SSR (Server-Side Rendering) e API REST
- Prisma como tecnologia ORM
- Banco de dados relacional MySQL
- Socket.io para comunicação em tempo real entre o servidor e o cliente