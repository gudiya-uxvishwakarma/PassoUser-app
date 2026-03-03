import React, {createContext, useState, useContext} from 'react';

const BookingContext = createContext();

export const BookingProvider = ({children}) => {
  const [bookings, setBookings] = useState([]);

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: `#BK${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (bookingId, status) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId ? {...booking, status} : booking
      )
    );
  };

  const getBookingById = (bookingId) => {
    return bookings.find((booking) => booking.id === bookingId);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        updateBookingStatus,
        getBookingById,
      }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within BookingProvider');
  }
  return context;
};
