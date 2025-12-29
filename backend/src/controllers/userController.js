const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const axios = require('axios');

const ServiceProvider = require("../models/ProviderModel");

exports.register = async (req, res) => {
  const { 
    first_name, last_name, email, phone, password, city, interests, birth_date, role,
    isProvider, providerData 
  } = req.body;

  try {
    const [existingUser] = await User.getUserByEmail(email);
    if (existingUser.length > 0) return res.status(400).json({ message: "User already exists" });

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await User.createUser({ first_name, last_name, email, phone, password_hash, city, interests, birth_date, role });
    const user_id = result.insertId;

    if (isProvider && providerData) {
      await ServiceProvider.create({
        user_id,
        field_of_work: providerData.serviceType,
        aboutProvider: providerData.aboutYou,
        id_card_number: Number(providerData.id_card_number),
        certifications: providerData.certifications,
        experience_photos: providerData.images.join(","), 
        hourly_rate: providerData.hourlyRate,
        service_locations: providerData.serviceLocations,
        years_of_experience: providerData.experienceYears,
        languages: providerData.languages,
        description: providerData.Description
      });
    }

    res.status(201).json({ message: "User registered successfully", user_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await User.getUserByEmail(email);
    if (rows.length === 0) return res.status(400).json({ message: "User not found" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    res.status(200).json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { first_name, last_name, email, phone, city } = req.body;
  try {
    const [rows] = await User.getUserById(userId);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    await User.updateUser(userId, { first_name, last_name, email, phone, city });
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const userId = req.params.id;
  const { oldPassword, newPassword } = req.body;
  try {
    const [rows] = await User.getUserById(userId);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    const newHash = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(userId, newHash);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.savePushToken = async (req, res) => {
  const { userId, expoToken } = req.body;

  if (!userId || !expoToken) {
    return res.status(400).json({ message: "userId and expoToken are required" });
  }

  try {
    await User.updatePushToken(userId, expoToken);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving token" });
  }
};


exports.sendPushNotification = async (req, res) => {
  const { userId, title, message } = req.body;

  if (!userId || !title || !message) {
    return res.status(400).json({ message: "userId, title, and message are required" });
  }

  try {
    const [rows] = await User.getPushTokenById(userId);
    if (!rows[0] || !rows[0].expo_push_token) {
      return res.status(404).json({ message: "Push token not found" });
    }

    const expoToken = rows[0].expo_push_token;
    await axios.post('https://exp.host/--/api/v2/push/send', {
      to: expoToken,
      sound: 'default',
      title: title,
      body: message,
      data: { userId }
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending notification" });
  }
};


