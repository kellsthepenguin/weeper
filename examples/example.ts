import Weeper from '../src/weeper.ts'

const app = new Weeper()

app.setErrorHandler(404, (req) => {
    req.respond({ body: 'not found' })
})

app.handle('/', 'GET', (req) => {
    req.respond({ body: '<h1>It Works!</h1>' })
})

app.listen(':8080')
