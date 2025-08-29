# member-site

## 概要
このプロジェクトは登録したユーザーのみがログインでき、ログイン後にTodoリストを操作できるといった会員サイトを構成するものです。

## 機能
- ユーザー登
- パスワードのリセット
- ログイン後にTodoリスト操作

## 使用技術
# フロントエンドフレームワーク
Next.js/React/TailwindCSS
# フロントエンド言語
TypeScript
# バックエンド
Node.js/Prisma/JWT/Redis
# データベース
PostgreSQL
# インフラ
Docker
# ログイン認証
Redis + JWT


## 使い方
1. コマンド: docker-compose up -d でDockerコンテナを起動
2. localehost:3000 にアクセスするとログイン画面へ遷移
- [会員登録はこちら] ボタンを押すと、会員登録画面へ
- パスワードを忘れた方はこちら