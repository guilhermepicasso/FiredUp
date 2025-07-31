# firedUp

Este repositório contém o código fonte para a aplicação firedUp, um sistema web desenvolvido com React e Node.js, utilizando MySQL como banco de dados.Esse sistema visa conectar pessoas interessadas em esportes dentro do Centro Universitário Senac.

## Estrutura do Projeto
O projeto está organizado em pastas distintas para facilitar a manutenção e o desenvolvimento:

* **adm-fired-up:** Cliente React para a administração do sistema.
* **fired-up:** Cliente React para o usuário aluno e docentes.
* **API:** API Node.js responsável pela lógica de negócio e acesso ao banco de dados.

## Como Rodar a Aplicação

**Pré-requisitos:**
* Node.js e npm (ou yarn) instalados.
* Um banco de dados MySQL configurado.

**Passos:**

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/guilhermepicasso/FiredUp.git]

2. **Instale as Dependências:**

# Navegue para cada pasta e execute:  

```bash
cd adm-fired-up  
npm install  

cd fired-up  
npm install  

cd api  
npm install
``` 

3. **Configure o Banco:**

* **Crie o banco de dados:** Utilize o script banco.sql localizado dentro da pasta API para criar o banco de dados e as tabelas.
* **Configure o arquivo .env:** Edite o arquivo conection.js dentro da pasta **API/SRC** e substitua o valor da variável **password** pela senha do seu banco de dados MySQL.

4. **Execute o sistema**

# Navegue para cada pasta e execute:  

```bash
cd adm-fired-up
npm install

cd ../fired-up
npm install

cd ../api
npm install
