#!/usr/bin/env bash
# Instalador do hook post-commit (push automático para o GitHub).
# Uso: bash scripts/install-hooks.sh   (ou: npm run hooks:install)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOOK_SOURCE="$ROOT/scripts/hooks/post-commit"
HOOK_DEST="$ROOT/.git/hooks/post-commit"

if [ ! -d "$ROOT/.git" ]; then
  echo "Erro: $ROOT não parece ser um repositório git (.git não encontrado)." >&2
  exit 1
fi

if [ ! -f "$HOOK_SOURCE" ]; then
  echo "Erro: hook de origem não encontrado em $HOOK_SOURCE" >&2
  exit 1
fi

cp "$HOOK_SOURCE" "$HOOK_DEST"
chmod +x "$HOOK_DEST"

echo "Hook post-commit instalado em $HOOK_DEST"
echo "A partir de agora, todo 'git commit' envia a branch atual para o GitHub."