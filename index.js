const express = require('express');
const app = express();
app.use(express.json());

const rooms = [
  {
    id: 101,
    numberOfSeats: 50,
    amenities: "A/C, Projector, WiFi",
    pricePerHour: 1000,
  },
  {
    id: 102,
    numberOfSeats: 30,
    amenities: "A/C, Whiteboard",
    pricePerHour: 800,
  },
];

const bookings = [];

// Helper function to generate a unique room ID
let nextRoomId = 103;
function generateRoomId() {
  return nextRoomId++;
}

// Helper function to get the current date in "YYYY-MM-DD" format
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to generate a unique booking ID
let nextBookingId = 1;
function generateBookingId() {
  return nextBookingId++;
}

//Home page
app.get("/", function (request, response) {
  response.send('Welcome to Hall Booking App');
});

// Endpoint to create a new room
app.post("/rooms", function (req, res) {
  const { numberOfSeats, amenities, pricePerHour } = req.body;
  const newRoom = {
    id: generateRoomId(),
    numberOfSeats,
    amenities,
    pricePerHour,
  };
  rooms.push(newRoom);
  res.send(newRoom);
});

// Endpoint to book a room
app.post("/bookings", function (req, res) {
  const { customerName, date, startTime, endTime, roomId } = req.body;
  const room = rooms.find((room) => room.id === roomId);

  if (!room) {
    res.status(404).send("Room not found.");
    return;
  }

  const isRoomAlreadyBooked = bookings.some(
    (booking) =>
      booking.roomId === roomId &&
      booking.date === date &&
      ((booking.startTime >= startTime && booking.startTime < endTime) ||
        (booking.endTime > startTime && booking.endTime <= endTime) ||
        (booking.startTime <= startTime && booking.endTime >= endTime))
  );

  if (isRoomAlreadyBooked) {
    res.status(400).send("Room is already booked at this time.");
    return;
  }

  const newBooking = {
    id: generateBookingId(),
    customerName,
    date,
    startTime,
    endTime,
    roomId,
  };
  bookings.push(newBooking);
  res.send(newBooking);
});

// Endpoint to list all rooms with booked data
app.get("/rooms-with-bookings", function (req, res) {
  const roomsWithBookings = rooms.map((room) => {
    const bookedData = bookings.filter((booking) => booking.roomId === room.id);
    return {
      roomName: `Room ${room.id}`,
      bookedData,
    };
  });
  res.send(roomsWithBookings);
});

// Endpoint to list all customers with their booked data
app.get("/customers-with-bookings", function (req, res) {
  const customersWithBookings = bookings.map((booking) => {
    const room = rooms.find((room) => room.id === booking.roomId);
    return {
      customerName: booking.customerName,
      roomName: `Room ${room.id}`,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      bookingId: booking.id,
      bookingDate: booking.date, // Use the actual booking date from the booking data
      bookingStatus: "Booked",
    };
  });
  res.send(customersWithBookings);
});

// Endpoint to list how many times a customer has booked a room
app.get("/customer-booking-count", function (req, res) {
  const customerBookingCount = {};
  bookings.forEach((booking) => {
    const key = `${booking.customerName}-${booking.roomId}`;
    if (!customerBookingCount[key]) {
      customerBookingCount[key] = {
        customerName: booking.customerName,
        roomName: `Room ${booking.roomId}`,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        bookingId: booking.id,
        bookingDate: booking.date, // Use the actual booking date from the booking data
        bookingStatus: "Booked",
        bookings: 1,
      };
    } else {
      customerBookingCount[key].bookings++;
    }
  });
  res.send(Object.values(customerBookingCount));
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


