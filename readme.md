# Supabase 認証テスト

Supabase を使用したユーザー認証と基本的な CRUD 操作の練習プロジェクトです。

## 実装機能

### ユーザー管理機能

- ユーザー一覧表示
- ユーザー情報の編集
- ユーザーの削除
- 検索機能（名前、メールアドレス）
- ソート機能（名前順）

### 技術スタック

- フロントエンド: HTML, CSS, JavaScript
- バックエンド: Supabase
- データベース: PostgreSQL (Supabase)

## プロジェクト構成

- `index.html`: メインのユーザーインターフェース
- `main.js`: Supabase との通信や UI の制御を行うメインスクリプト
- `generate-config.js`: 環境変数から設定ファイルを生成するスクリプト
- `.env.example`: 環境変数のテンプレート

## セットアップ手順

1. 環境変数の設定

```bash
# .env.exampleをコピーして.envを作成
cp .env.example .env

# .envファイルを編集し、Supabase認証情報を設定
# SUPABASE_URL: プロジェクトのURL
# SUPABASE_KEY: プロジェクトのanonキー
```

2. 設定ファイルの生成

```bash
# config.jsを生成
node generate-config.js
```

3. アプリケーションの起動

- ブラウザで`index.html`を開く

## Supabase の設定

### 必要な設定

1. Database > Tables
   - `users`テーブルの作成
   - RLS ポリシーの設定

### テーブル構造

```sql
-- usersテーブル
id: uuid (primary key)
name: text
email: text
created_at: timestamp with time zone
auth_id: uuid (Supabase Authとの紐付け用)
```

## ファイル構造

```
.
├── generate-config.js
├── index.html
├── main.js
└── readme.md
```

## セキュリティに関する注意

- `.env`ファイルは決して Git にコミットしないでください
- `config.js`は自動生成されるファイルであり、Git にコミットしないでください
- 実際の API キーは必ず`.env`ファイルで管理してください
