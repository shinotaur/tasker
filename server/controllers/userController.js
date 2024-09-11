import User from '../models/user.js';
import { createJWT } from '../utils/index.js';
import Notice from '../models/notification.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin, role, title } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res
        .status(400)
        .json({ message: 'User already exists', status: false });
    }

    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
      role,
      title,
    });

    if (user) {
      isAdmin ? createJWT(res, user._id) : null;
      user.password = undefined;
      res
        .status(201)
        .json({ message: 'User created successfully', status: true, user });
    } else {
      return res
        .status(400)
        .json({ message: 'Invalid User Data', status: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message, status: false });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: 'Invalid email or password.' });
    }

    if (!user?.isActive) {
      return res.status(401).json({
        status: false,
        message: 'User account has been deactivated, contact the administrator',
      });
    }

    const isMatch = await user.matchPassword(password);

    if (user && isMatch) {
      createJWT(res, user._id);

      user.password = undefined;

      res.status(200).json(user);
    } else {
      return res
        .status(401)
        .json({ status: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
// export const loginUser = async (req, res) => {
//   try{
//     const {email, password} = req.body;
//     const user = await User.findOne({email});
//
//     if(user && (await user.matchPassword(password))){
//       createJWT(res, user._id);
//       user.password = undefined;
//        res.status(200).json({message: "Login Successful", status: true, user});
//     }else{
//       return res.status(400).json({message: "Invalid Credentials", status: false});
//     }
//
//     if(!user?.isActive){
//       return res.status(401).json({
//       status: false,
//       message: 'User account has been deactivated, contact the administrator.'
//       })
//     }
//    }catch(error){
//      console.log(error);
//      return res.status(400).json({message: error.message, status: false});
//    }
// }

export const logoutUser = (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Logout Successful', status: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message, status: false });
  }
};

export const getTeamList = async (req, res) => {
  try {
    const users = await User.find().select('name title role email isActive');
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message, status: false });
  }
};

export const getNotificationsList = async (req, res) => {
  try {
    const { userId } = req.user;
    const notice = await Notice.find({
      team: userId,
      isRead: { $nin: [userId] },
    }).populate('task', 'title');
    res.status(201).json(notice);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message, status: false });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;
    const { _id } = req.body;
    const id =
      isAdmin && userId === _id
        ? userId
        : isAdmin && userId !== _id
        ? _id
        : userId;
    const user = await User.findById(id);
    if (user) {
      user.name = req.body.name || user.name;
      user.title = req.body.title || user.title;
      user.role = req.body.role || user.role;
      const updatedUser = await user.save();
      user.password = undefined;
      res.status(200).json({
        message: 'User Profilec updated successfully',
        status: true,
        user: updatedUser,
      });
    } else {
      return res
        .status(404)
        .json({ message: 'User not Found!', status: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message, status: false });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { userId } = req.user;

    const { isReadType, id } = req.query;

    if (isReadType === 'all') {
      await Notice.updateMany(
        { team: userId, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    } else {
      await Notice.findOneAndUpdate(
        { _id: id, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    }

    res.status(201).json({ status: true, message: 'Done' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (user) {
      user.password = req.body.password;
      await user.save();
      res
        .status(201)
        .json({ message: 'Password updated successfully', status: true });
    } else {
      return res
        .status(404)
        .json({ message: 'User not found!', status: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message, status: false });
  }
};

export const activateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      user.isActive = req.body.isActive;
      await user.save();
      res.status(201).json({
        message: `User account has been ${
          user?.isActive ? 'activated' : 'deactivated'
        }`,
        status: true,
      });
    } else {
      return res
        .status(404)
        .json({ message: 'User not found!', status: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message, status: false });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ status: true, message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
