# g0v.tomoyo.systems

Landing e infraestrutura do g0v da Tomoyo: os projetos de dados públicos do coletivo, nos moldes
do g0v de Taiwan. Cada projeto tem o seu repositório; este guarda o que é comum.

| Projeto | Repositório | Caminho |
| --- | --- | --- |
| Perdeu, Playboy | [perdeu-playboy](https://github.com/Tomoyo-Computer-Science-Research-Unit/perdeu-playboy) | `/perdeu-playboy/` |
| Emendas | [emendas-rj](https://github.com/Tomoyo-Computer-Science-Research-Unit/emendas-rj) | `/emendas/` |
| Como votou seu vereador | [como-votou](https://github.com/Tomoyo-Computer-Science-Research-Unit/como-votou) | `/vereadores/` |

## O que há aqui

```text
site/                 landing (HTML, CSS, JS, mon), com os efeitos do tomoyo.systems
conf/default.conf     nginx: um servidor estático para a raiz e todos os projetos
docker-compose.yml    container g0v-static (nginx:alpine) atrás do Traefik do servidor
cron.d/g0v            as rodadas diárias de cada projeto, instalado em /etc/cron.d/g0v
build-landing.sh      publica landing, conf e cron a partir de main
```

## Como o servidor funciona

Um droplet da DigitalOcean (`mail.tomoyo.systems`) com Traefik na frente e um nginx estático em
`/root/g0v`: `site/` é a raiz servida, `conf/` a configuração, `docker-compose.yml` o container.
A Cloudflare fica na frente de tudo e guarda css, js e imagens por sete dias; por isso o HTML da
landing referencia os assets com o hash do commit.

Cada projeto publica o seu subdiretório de `site/` com um script próprio, instalado em
`/root/g0v/build-<projeto>.sh`, que o cron roda uma vez por dia. O script puxa `main` do
repositório do projeto, se atualiza quando o arquivo em `deploy/` mudou, baixa de novo os dados
oficiais, regenera o snapshot e só reconstrói o site quando o commit ou os dados mudaram. Falhas
avisam por e-mail pelo mailserver da própria máquina. Não existe credencial do GitHub no servidor:
tudo é lido dos repositórios públicos.

A landing segue o mesmo desenho: `build-landing.sh` puxa este repositório, publica `site/` sem
tocar nos subdiretórios dos projetos, copia `conf/` e `cron.d/g0v`, testa e recarrega o nginx.

Para publicar na hora, depois de um push:

```bash
ssh root@mail.tomoyo.systems 'FORCE=1 /root/g0v/build-landing.sh'
```

## Primeira instalação de um projeto novo

1. No repositório do projeto, um `deploy/build-site.sh` nos moldes dos existentes, publicando em
   `/root/g0v/site/<slug>`.
2. `scp deploy/build-site.sh root@mail.tomoyo.systems:/root/g0v/build-<slug>.sh` e uma primeira
   rodada com `FORCE=1`.
3. A linha de cron em `cron.d/g0v`, o link e o cartão em `site/index.html`, e push aqui.
