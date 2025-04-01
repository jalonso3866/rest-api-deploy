const z = require('zod')

const movieSchema = z.object({
    title: z.string({
        message: 'El titulo debe ser un string de 1 a 300 caracteres',
    }).min(1).max(300),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Thriller', 'Sci-fi','Crime']),
        {
                required_error: 'El genero es requerido.'
        }
        ),
    year: z.number({
        message: 'El año debe ser un numero positivo'
    }).min(1900,{ message: "El año debe de ser mayor de 1900"}).max(2030),
    director: z.string({
        message: 'El director debe ser un string de 1 a 100 caracteres',
    }).min(1).max(100),
    duration: z.number().min(1).max(500),
    rate: z.number().min(0).max(10).optional(),
    poster: z.string().url({
        message: 'El poster debe ser una URL valida'
    })
})

function validateMovie(object) {
        return movieSchema.safeParse(object) 
}

function validatePartialMovie(object) {
    return movieSchema.partial().safeParse(object)
}

module.exports = {
    validateMovie, 
    validatePartialMovie
}