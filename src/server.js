import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

//Base de datos en memoria

const fotos = [
    {
        id: 1, titulo: 'Atardecer',  calificacion: 4.5,
        descripcion: 'Playa de Montanita'},
    {
        id: 2, titulo: 'Malecon', calificacion: 4.8,
        descripcion: 'Guayaquil de noche'},
    {
        id: 3, titulo: 'Ciudad', calificacion: 4.2,
        descripcion: 'Centro histórico de Quito'
    }
]

app.get('/api/fotos', (req,res) => {
    res.json(fotos);
});


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});


app.use(express.json());

app.use((req, res, next ) => {
    const hora = new Date().toISOString();
    console.log(`[${hora}] ${req.method} ${req.url}`);
    next();
})

app.get('/api/fotos/:id', (req, res) => {
    const id = Number(req.params.id);
    const foto = fotos.find(f => f.id === id);
    if (!foto) {
        return res.status(404).json({ error: 'Foto no encontrada' });
    }
    res.json(foto);
});

app.post('/api/fotos', (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Envía un cuerpo JSON con Content-Type: application/json' });
    }
    const { titulo, calificacion, descripcion } = req.body;
    if (!titulo){
        return res.status(400).json({ error: 'El título es obligatorio' });
    }
    const nueva = {
        id: fotos.length + 1,
        titulo,
        descripcion,
        calificacion,
    };
    fotos.push(nueva);
    res.status(201).json(nueva);
});

app.get('/api/error', async () => {
    throw new Error('Algo salió mal');
});

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
});