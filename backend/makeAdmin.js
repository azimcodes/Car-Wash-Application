import sequelize from './config/db.js';
import User from './models/User.js';

async function makeAdmin(email) {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ User ${email} is now an admin`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating user role:', err);
    process.exit(1);
  }
}

// Call the function with the email of the user you want to make admin
makeAdmin('azimtries@gmail.com');
