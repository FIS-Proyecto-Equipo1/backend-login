const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

let rolesValidos = {
    values: ["ADMIN", "USER"],
    message: '{VALUE} no es un role válido'
}

const usuarioSchema = new mongoose.Schema({
    // userId: { type: Number, required: true, index: { unique: true } },
    email: { type: String, required: [true, "El correo es necesario"], index: { unique: true } },
    password: { type: String, required: [true, "La contraseña es obligatoria"] },
    rol: { type: String, default: 'USER', required: true, enum: rolesValidos },
    nombre: { type: String, required: [true, "El nombre es necesario"] },
    apellidos: { type: String, required: [true, "Los apellidos son necesarios"] },
    telefono: { type: String, required: false },
    cuentaBancaria: { type: String, required: [true, "La cuenta bancaria es necesaria"] },
});



usuarioSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

usuarioSchema.methods.cleanup = function () {
    return {
        username: this.username, password: this.password,
        fullname: this.fullname, phone: this.phone, age: this.age
    };
}

usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    userObject.userId = userObject._id;
    delete userObject._id;
    return userObject;
}

mongoose.set('useCreateIndex', true);

const Usuarios = mongoose.model('Usuarios', usuarioSchema);
module.exports = Usuarios;
