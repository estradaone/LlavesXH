const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminController = {
    async login(req, res) {
        try {
            const { correo, password } = req.body;

            const results = await Admin.findByEmail(correo);

            if (results.length === 0) {
                return res.status(401).json({ message: 'Usuario no encontrado' });
            }

            const admin = results[0];

            // Comparar contraseña (ajusta según si está encriptada o no)
            const match = password === admin.password;
            // Si usas bcrypt:
            // const match = await bcrypt.compare(password, admin.password);

            if (!match) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }

            // Generar token JWT
            const token = jwt.sign(
                { id: admin.id_admin, correo: admin.correo },
                process.env.JWT_SECRET || 'clave_secreta',
                { expiresIn: '1h' }
            );

            return res.json({ message: 'Login exitoso', token });
        } catch (error) {
            console.error('Error en login:', error);
            return res.status(500).json({ message: 'Error en servidor' });
        }
    },

    async verify(req, res) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                return res.status(401).json({ message: 'Token no proporcionado' });
            }

            jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta', (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: 'Token inválido o expirado' });
                }

                return res.json({ message: 'Token válido', user: decoded });
            });
        } catch (error) {
            console.error('Error en verificación:', error);
            return res.status(500).json({ message: 'Error en servidor' });
        }
    }
};

module.exports = adminController;
