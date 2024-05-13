import express from 'express'

const app = express()

app.set('port', process.env.PORT || 3000)

app.get("/", (req, res) => {
    res.send("Hi")
})

app.listen(app.get('port'), () => {
    console.log(`Server is running on https://localhost/${app.get('port')}`)
})
