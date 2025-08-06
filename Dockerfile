# Node.js の公式イメージを使用
FROM node:20

# 作業ディレクトリを作成
WORKDIR /app

# 必要なパッケージをインストール(ビルドツール)
Run apt-get update && apt-get install -y \
  build-essential \
  python3 \
  python3-pip \
  && rm -rf /var/lib/apt/lists/*  

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# プロジェクト全体をコンテナにコピー
COPY . .

# ポート3000を開ける
EXPOSE 3000

# コンテナ起動時のコマンド
CMD ["npm", "run", "dev"]

# Prisma Client の生成がビルド時に行われる
RUN npx prisma generate
