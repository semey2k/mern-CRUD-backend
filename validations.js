import { body } from "express-validator";

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 1 символ').isLength({ min : 1}),
]

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 1 символ').isLength({ min : 1}),
    body('fullName', 'Укажите имя').isLength({min: 3}),
]
