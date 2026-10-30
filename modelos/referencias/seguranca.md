# Base de conhecimento: Segurança

**Maturidade:** rascunho (leitura feita em 2026-10-29, sem caso real ainda)
**Agente:** Segurança (harness em `modelos/agentes/seguranca.md`)
**Skills que saem daqui:** `metodo:autenticacao-e-sessao`, `metodo:controle-de-acesso`, `metodo:entrada-nao-confiavel` e `metodo:incidente-com-dados-pessoais`

O que a leitura das referências escolhidas pela pessoa ensinou, com palavras próprias: a regra concreta, o porquê e o link. É o segundo lugar onde o agente procura, depois do `docs/referencias/seguranca.md` do projeto e antes dos sites. As skills também servem a quem corrige (as trabalhadoras do back e do front). A segurança do CI fica com `metodo:ci-seguro`, do DevOps.

## Autenticação e senhas (NIST SP 800-63B-4 e OWASP)

| Regra | Por quê | Fonte |
|---|---|---|
| Senha de pelo menos 15 caracteres quando é o único fator; 8 quando faz parte de um segundo fator; aceitar pelo menos 64, com espaço e Unicode | comprimento protege mais que regra de composição | [NIST 800-63B-4, 3.1.1](https://pages.nist.gov/800-63-4/sp800-63b.html) |
| Sem regra de composição (maiúscula, número, símbolo), sem troca periódica (só quando há sinal de vazamento), sem dica e sem pergunta secreta | essas regras levam a senhas previsíveis | [NIST 800-63B-4, 3.1.1](https://pages.nist.gov/800-63-4/sp800-63b.html) |
| Conferir a senha nova contra listas de senhas vazadas, comuns e do contexto, dizendo o motivo da recusa | é o que o atacante tenta primeiro | [NIST 800-63B-4, 3.1.1](https://pages.nist.gov/800-63-4/sp800-63b.html) |
| Permitir gerenciador de senhas, preenchimento automático e colar; oferecer "mostrar senha" | senha longa só é viável assim | [NIST 800-63B-4, 3.1.1](https://pages.nist.gov/800-63-4/sp800-63b.html) |
| Limite de tentativas por conta (no máximo 100 seguidas antes de bloquear o fator), não por IP | o atacante troca de IP | [NIST 800-63B-4, 3.2.2](https://pages.nist.gov/800-63-4/sp800-63b.html) e [OWASP, autenticação](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) |
| Oferecer pelo menos uma opção resistente a phishing (chave de acesso, passkey) no nível AAL2; senha e código por SMS ou e-mail não resistem | phishing é o ataque mais comum | [NIST 800-63B-4, 3.2.5](https://pages.nist.gov/800-63-4/sp800-63b.html) |
| Sessão no nível AAL2: reautenticar em até 24 h no total e até 1 h sem uso | limita o estrago de uma sessão roubada | [NIST 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html) |
| Mesma mensagem, mesmo código e mesmo tempo de resposta para conta inexistente, senha errada e conta bloqueada; recuperação e cadastro não revelam se o e-mail existe | não entregar quem tem conta | [OWASP, autenticação](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) |
| Trocar senha ou e-mail pede a senha atual (ou passkey); bloqueio não pode virar arma: a recuperação desbloqueia | sessão esquecida aberta não vira tomada de conta | [OWASP, autenticação](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) |
| Guardar senha com Argon2id (mínimo m=19 MiB, t=2, p=1); scrypt se não houver; bcrypt só em legado, com custo 10 ou mais e limite de 72 bytes; algoritmo e parâmetros guardados junto, e atualização do hash no próximo login | quebrar o hash precisa ficar caro | [OWASP, armazenamento de senhas](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) |
| Identificador de sessão aleatório (64 bits de entropia ou mais), trocado no login e em toda mudança de privilégio, só em cookie, nunca na URL | fixação e vazamento de sessão | [OWASP, sessão](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) |
| Cookie de sessão com `Secure`, `HttpOnly`, `SameSite=Strict` ou `Lax`, prefixo `__Host-`, sem `Domain`; tempo sem uso e tempo total no servidor; sair invalida no servidor | o cookie é a chave da conta | [OWASP, sessão](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) |

## Controle de acesso (OWASP)

| Regra | Por quê | Fonte |
|---|---|---|
| Negar por padrão; conferir a permissão em toda requisição, no servidor, de forma central | o atacante só precisa de uma porta | [OWASP, autorização](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) |
| Conferir o acesso ao objeto pedido (a fatura é deste usuário?), não só o tipo | acesso a um objeto não dá acesso aos outros (IDOR) | [OWASP, autorização](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) |
| Esconder botão na tela não é controle de acesso | a rota continua aberta | [OWASP, autorização](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) |
| Arquivos estáticos e armazenamento na nuvem entram nas regras de acesso | link público previsível é acesso para todos | [OWASP, autorização](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) |
| Testes automáticos do controle de acesso: negar por padrão, acesso ao objeto alheio, falha segura | a regra quebra sem ninguém ver | [OWASP, autorização](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) |
| Para a revisão, os requisitos verificáveis do ASVS 5.0.0 (maio de 2025) | lista objetiva do que conferir | [OWASP ASVS](https://asvs.owasp.org/) |

## Entrada não confiável (OWASP)

| Regra | Por quê | Fonte |
|---|---|---|
| Toda consulta com parâmetros; nome de tabela, coluna e direção de ordenação vêm de uma lista fixa no código, nunca do texto do usuário; conta do banco com o mínimo de permissão | injeção de SQL | [OWASP, injeção de SQL](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) e [parametrização](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html) |
| Confiar no escape automático do framework; as saídas de emergência (`dangerouslySetInnerHTML`, `innerHTML`) só com HTML limpo por DOMPurify; preferir `textContent` | XSS | [OWASP, XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) |
| URL em `href` e `src` só com `http` ou `https`; recusar `javascript:` | XSS por link | [OWASP, XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) |
| CSP como segunda camada, ajustada ao app, nunca como a única | ajuda quando a primeira falha | [OWASP, XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) |
| Servidor que busca URL do usuário: lista de destinos permitidos, conferência do IP depois de resolver o nome, bloqueio de endereços internos e de metadados da nuvem (169.254.169.254), sem seguir redirecionamento, rede restrita | SSRF | [OWASP, SSRF](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html) |

## Dados pessoais e incidentes (ANPD)

| Regra | Por quê | Fonte |
|---|---|---|
| Comunicar à ANPD e aos titulares o incidente que pode causar risco ou dano relevante: afeta significativamente interesses e direitos **e** envolve dado sensível, de criança, adolescente ou idoso, financeiro, de autenticação, protegido por sigilo ou em larga escala | é o critério da lei | [Resolução CD/ANPD nº 15/2024, art. 5](https://bibliotecadigital.mj.gov.br/bitstream/1/12879/2/RES_ANPD_2024_15.html) |
| Prazo: 3 dias úteis do conhecimento do incidente, para a ANPD e para os titulares; complementar em até 20 dias úteis; agente de pequeno porte tem prazo em dobro | prazo legal | [Resolução nº 15/2024, arts. 6 e 9](https://bibliotecadigital.mj.gov.br/bitstream/1/12879/2/RES_ANPD_2024_15.html) |
| O aviso aos titulares, em linguagem simples: natureza e categoria dos dados, medidas tomadas, riscos, motivo da demora, como mitigar, data do conhecimento e contato do encarregado | é o conteúdo exigido | [Resolução nº 15/2024, art. 9](https://bibliotecadigital.mj.gov.br/bitstream/1/12879/2/RES_ANPD_2024_15.html) |
| Registrar todo incidente com dados pessoais, comunicado ou não, por pelo menos 5 anos | a ANPD pode pedir | [Resolução nº 15/2024, art. 10](https://bibliotecadigital.mj.gov.br/bitstream/1/12879/2/RES_ANPD_2024_15.html) |
| Canal oficial da comunicação | onde comunicar | [ANPD, comunicação de incidente](https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis) |

A ANPD é a autoridade da lei; confira a data e a versão de cada norma antes de usar. Decidir se o incidente é comunicável e comunicar é da pessoa (com o encarregado e, se houver, o jurídico); a Segurança prepara os fatos.

## Outras referências do harness

PortSwigger Research (https://portswigger.net/research), GitHub Security Lab (https://securitylab.github.com/) e Trail of Bits (https://blog.trailofbits.com/) servem a casos específicos (uma técnica de ataque, uma falha em dependência, uma auditoria) e não foram resumidos aqui; a segurança dos workflows do GitHub Actions já está em `modelos/referencias/devops.md`.
