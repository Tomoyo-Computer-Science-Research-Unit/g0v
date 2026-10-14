#!/usr/bin/env bash
# Roda no droplet, por cron: puxa main deste repositório e publica a landing de
# g0v.tomoyo.systems (raiz de /root/g0v/site), a config do nginx e o arquivo de cron de todos os
# projetos. Os subdiretórios de site/ (perdeu-playboy, emendas, ...) pertencem aos projetos e
# nunca são tocados aqui.
#
#   /root/g0v/build-landing.sh            # só publica se main mudou
#   FORCE=1 /root/g0v/build-landing.sh    # publica de qualquer jeito
set -euo pipefail
export PATH=/usr/local/bin:/usr/bin:/bin

REPO="${REPO:-https://github.com/Tomoyo-Computer-Science-Research-Unit/g0v.git}"
DIR="${DIR:-/root/g0v}"
SRC="$DIR/src-g0v"
MARK="$DIR/.landing-built"

log() { echo "$(date -Is) $*"; }

[ -d "$SRC/.git" ] || git clone -q "$REPO" "$SRC"
git -C "$SRC" fetch -q origin main
git -C "$SRC" reset -q --hard origin/main
rev="$(git -C "$SRC" rev-parse --short HEAD)"

# O script instalado é uma cópia deste arquivo; quando main o muda, troca e recomeça.
if ! cmp -s "$SRC/build-landing.sh" "$0"; then
  cp "$SRC/build-landing.sh" "$0"
  chmod 755 "$0"
  log "script atualizado a partir de $rev; recomeçando"
  exec "$0" "$@"
fi

if [ "${FORCE:-0}" != "1" ] && [ -f "$MARK" ] && [ "$(cat "$MARK")" = "$rev" ]; then
  exit 0
fi

# A Cloudflare guarda css/js/png por 7 dias: o HTML referencia os assets com o hash do commit.
stage="$(mktemp -d)"
chmod 755 "$stage"
cp -r "$SRC/site/." "$stage/"
sed -i "s/VERSION/$rev/g" "$stage/index.html"
mkdir -p "$DIR/site"
rsync -a --delete --exclude='/*/' --chmod=D755,F644 "$stage/" "$DIR/site/"
rm -rf "$stage"

rsync -a --chmod=D755,F644 "$SRC/conf/" "$DIR/conf/"
cp "$SRC/docker-compose.yml" "$DIR/docker-compose.yml"
install -m 644 "$SRC/cron.d/g0v" /etc/cron.d/g0v
docker exec g0v-static nginx -t >/dev/null 2>&1
docker exec g0v-static nginx -s reload 2>/dev/null
echo "$rev" > "$MARK"
log "landing publicada ($rev)"
