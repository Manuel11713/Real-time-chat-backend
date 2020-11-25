"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateRegister = void 0;
exports.validateRegister = (usename, email, password) => {
    let errors = {};
    if (usename.trim() === '')
        errors.username = 'username must not be empty';
    if (email.trim() === '')
        errors.email = 'email must not be empty';
    if (password.trim() === '')
        errors.password = 'password must not be empty';
    return { errors, valid: Object.keys(errors).length == 0 };
};
exports.validateLogin = (email, password) => {
    let errors = {};
    if (email.trim() === '')
        errors.email = 'email must not be empty';
    if (password.trim() === '')
        errors.password = 'password must not be empty';
    return { errors, valid: Object.keys(errors).length == 0 };
};
