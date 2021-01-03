import Weeper from '../src/weeper.ts'

const app = new Weeper()

app.setErrorHandler(404, (req) => {
    req.respond({ body: 'not found' })
})

app.handle('/', 'GET', (req) => {
    req.respond({ body: 'success' })
})

app.listen(':8080')
