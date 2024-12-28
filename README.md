Библиотека предназначена для централизованного управления интерфейсами и методами API, упрощая их повторное использование, поддержку и интеграцию на платформе [NextBox](https://next-box.ru/). Она отделяет логику API от основной бизнес-логики, обеспечивая единое место для определения и работы с API-интерфейсами.

#### NPM Установка

```
npm install nb-js-client
```

#### Простой пример использования

```javascript
import { Client } from 'nb-js-client';

const api = new Client({
	host: 'https://site.com',
})

// Перехват запроса (обработка параметров запроса)
api.request.use((params: RequestParams) => {
	return Promise.resolve({...params});

}, (error) => return Promise.reject(error))

// Перехват ответа (обработка параметров ответа)
api.response.use((params: Response) => {
	if (!params.ok) {
        return Promise.reject({...params});
    }

	return Promise.resolve({...params});

}, (error) => return Promise.reject(error))

// Изменение настроек подключения
api.resetParams({...})

//Вызов метода из сервиса
api.UserApi.list().then(...)
```
