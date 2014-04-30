
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
| Query           | Descrição                                          |
|-----------------|----------------------------------------------------|
| **AreaId**      | O Id da área da qual se querem testes.             |
| **Grade**       | O grau (1º ano = 1, 2º = 2, etc.) de escolaridade. |
| **ProfessorId** | O Id do professor para o qual se querem testes.    |
| **AllContent**  | 1 se se quiser transferir tudo, 0 caso contrário.  |

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