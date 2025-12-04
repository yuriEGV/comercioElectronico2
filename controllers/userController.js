import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';

// Obtener todos los usuarios (solo admin)
const getAllUsers = async (req, res) => {
const users = await User.find({}).select('-password');
res.status(StatusCodes.OK).json({ users });
};

// Obtener un usuario por ID
const getSingleUser = async (req, res) => {
const { id } = req.params;
const user = await User.findById(id).select('-password');
if (!user) throw new NotFoundError(`No user with id ${id}`);
res.status(StatusCodes.OK).json({ user });
};

// Mostrar el usuario actual
const showCurrentUser = async (req, res) => {
res.status(StatusCodes.OK).json({ user: req.user });
};

// Actualizar información del usuario
const updateUser = async (req, res) => {
const { name, email } = req.body;
const user = await User.findByIdAndUpdate(
req.user.userId,
{ name, email },
{ new: true, runValidators: true }
);
res.status(StatusCodes.OK).json({ user });
};

// Actualizar contraseña del usuario
const updateUserPassword = async (req, res) => {
const { oldPassword, newPassword } = req.body;
const user = await User.findById(req.user.userId);
if (!user) throw new BadRequestError('User not found');

const isPasswordCorrect = await user.comparePassword(oldPassword);
if (!isPasswordCorrect) throw new BadRequestError('Invalid current password');

user.password = newPassword;
await user.save();
res.status(StatusCodes.OK).json({ msg: 'Password updated' });
};

// export nombrado para ESModules
export { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword };
