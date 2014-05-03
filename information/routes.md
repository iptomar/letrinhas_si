
# Rotas para a app

**Nota:** Rotas do tipo `/Rota/{:id}`, o `{:id}` é substituído por um número.

Isto traduz-se desta forma: `/Rota/5`

Se o parâmetro estiver com um '?', é opcional.

### Testes:
  
  * GET `/Tests/{:id?}`
  * GET `/Tests/Random`

  * GET + POST `/Tests/Create`
  * GET + POST `/Tests/Edit`
  * GET + POST `/Tests/Delete`
  * GET + POST `/Tests/{:id}/Results`

  * POST `/Tests/{:id}/PostResults`

#### Query parameters:
| Query           | Descrição                                          | Obrigatório |
|-----------------|----------------------------------------------------|-------------|
| **areaId**      | O Id da área da qual se querem testes.             | Não         |
| **grade**       | O grau (1º ano = 1, 2º = 2, etc.) de escolaridade. | Não         |
| **professorId** | O Id do professor para o qual se querem testes.    | Não         |
| **allContent**  | 1 se se quiser transferir tudo, 0 caso contrário.  | Não         |

***

### Escolas:

  * GET `/Schools/{:id?}`

  * GET + POST `/Schools/Create`
  * GET + POST `/Schools/Edit/{:id}`
  * GET + POST `/Schools/Delete/{:id}`

***

### Professores:

  * GET `/Professors/{:id?}`

  * GET + POST `/Professors/Create`
  * GET + POST `/Professors/Edit/{:id}`
  * GET + POST `/Professors/Delete/{:id}`

***

### Alunos:

  * GET `/Students/{:id?}`
  * GET `/Students/{:id}/TestResults`

  * GET + POST `/Students/Create`
  * GET + POST `/Students/Edit/{:id}`
  * GET + POST `/Students/Delete/{:id}`

***

### Turmas:

  * GET `/Classes/{:id?}`

  * GET + POST `/Classes/Create`
  * GET + POST `/Classes/Edit/{:id}`
  * GET + POST `/Classes/Delete/{:id}`

### Testes:

  * GET `/Tests/{:id?}`

#### Query parameters:
| Query             | Descrição                                           | Obrigatório               |
|-----------------  |---------------------------------------------------- |-------------------------- |
| **type**          | O tipo de teste que se quer.                        | Sim se `id` for omitido.  |
|                   | 0 = Texto normal, 1 = Escolha Múltipla, 2 = Lista.  |                           |
| **grade**         | O grau (1º ano = 1, 2º = 2, etc.) de escolaridade.  | Não                       |
| **professorId**   | O Id do professor para o qual se querem testes.     | Não                       |
| **areaId**        | O id da área para o qual se querem testes.          | Não                       |

# Outputs

## Situação normal

Normalmente o resultado é OU um array de objetos OU um objeto, no caso de correr tudo bem.
O output depende do serviço que é pedido ao servidor.

## Erros

Em caso de erros, o servidor irá enviar o seguinte conteúdo:

### Erro do servidor (50X)
Se o erro for por parte do servidor, o output será nada, a não ser que seja
uma exceção de validação, em que aí mandará a mensagem de erro.

### Erro do cliente (40X)

#### Erros de pedido mal formado (400)
Estes erros são enviados se faltarem parâmetros na query string.
Neste caso, é enviada uma string de erro.

#### Erros de not found (404)
Nada é enviado caso a rota não exista. Se não houver conteúdo para a query pedida
pelo cliente, o resultado é um array vazio (`[]`).

## Outputs em caso de POST de conteúdos

Quando é feito um POST para o servidor, a não ser que seja necessário, o servidor não
vai enviar qualquer conteúdo na resposta.