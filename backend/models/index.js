import User from './User.js';
import Place from './Place.js';
import Booking from './Booking.js';
import Car from './Car.js';

// associations
Booking.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Booking, { foreignKey: 'userId' });

Booking.belongsTo(Place, { foreignKey: 'placeId' });
Place.hasMany(Booking, { foreignKey: 'placeId' });

Car.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Car, { foreignKey: 'userId' });

export { User, Place, Booking, Car };
