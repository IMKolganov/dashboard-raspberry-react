# Используем официальный образ Node.js как базовый
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем curl
RUN apk update && apk add --no-cache curl

# Копируем package.json и package-lock.json (или yarn.lock)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код приложения
COPY . .

# Собираем приложение
RUN npm run build

# Устанавливаем переменную окружения для статического сервера
ENV PORT=3000

# Устанавливаем команду для запуска сервера
CMD ["npx", "serve", "-s", "build", "-l", "3000"]

# Открываем порт для приложения
EXPOSE 3000