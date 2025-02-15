# Supabase 認証テスト

## セットアップ手順

1. 環境変数の設定

```bash
# .env.exampleをコピーして.envを作成
cp .env.example .env

# .envファイルを編集し、実際のSupabase認証情報を設定
# SUPABASE_URL: プロジェクトのURL
# SUPABASE_KEY: プロジェクトのanonキー
```

2. 設定ファイルの生成

```bash
# config.jsを生成
node generate-config.js
```

3. アプリケーションの起動

- index.html をブラウザで開く

## セキュリティに関する注意

- `.env`ファイルは決して Git にコミットしないでください
- `config.js`は自動生成されるファイルであり、Git にコミットしないでください
- 実際の API キーは必ず`.env`ファイルで管理してください
