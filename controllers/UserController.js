import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
      Created: new Date().toLocaleString(),
      LastLogin: new Date().toLocaleString(),
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      { expiresIn: '30d' },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось зарегестрироваться',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    await UserModel.updateOne({
      email: req.body.email,
    },{
      LastLogin: new Date().toLocaleString(),
    })

    if (!user) {
      return res.status(404).json({
        message: 'Неверный логин или пароль',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      { expiresIn: '30d' },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

   
    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const user = await UserModel.find();

    res.json(user);
  }
catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const userId = req.params.id;
     
    UserModel.findOneAndRemove({
      _id: userId,
    }, (err, doc) => {
      if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить пользователя',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Пользователь не найден',
          });
        }

        res.json({
          success: true,
        });
    })
  
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const block = async (req, res) => {
  try {
    const userId = req.params.id;

    await UserModel.updateOne(
      {
        _id: userId,
      },
      {$set: {
        status: "заблокирован",
      }
      },
    );

    const user = await UserModel.find();
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось заблокировать пользователя',
    });
  }
};

export const unblock = async (req, res) => {
  try {
    const userId = req.params.id;
    await UserModel.updateOne(
      {
        _id: userId,
      },
      { $set: {
        status: "открыт",
      }
      },
    );

    const user = await UserModel.find();
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось заблокировать пользователя',
    });
  }
};
