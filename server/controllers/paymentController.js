const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { sendBookingEmail } = require('../utils/email');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    try {
        const { eventId, amount } = req.body;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.availableSeats <= 0) {
            return res.status(400).json({ message: 'Event is fully booked' });
        }

        // Bypassing Razorpay for Free Events (amount is 0)
        if (amount === 0) {
            const booking = await Booking.create({
                userId: req.user.id,
                eventId: eventId,
                status: 'confirmed',
                paymentStatus: 'paid',
                amount: 0,
                razorpayOrderId: `free_${Date.now()}`
            });
            event.availableSeats -= 1;
            await event.save();
            await sendBookingEmail(req.user.email, req.user.name, event.title);
            return res.status(200).json({ isFree: true, booking });
        }

        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ message: 'Failed to create Razorpay order' });
        }

        // 🌟 NEW: Create a "Pending" booking immediately when payment is initiated
        await Booking.create({
            userId: req.user.id,
            eventId: eventId,
            status: 'pending',
            paymentStatus: 'not_paid',
            amount: amount,
            razorpayOrderId: order.id
        });

        res.status(200).json({ orderId: order.id, amount: order.amount });
    } catch (error) {
        console.error('Razorpay Create Order Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            eventId,
            amount,
        } = req.body;

        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Find the pending booking we created earlier
            const booking = await Booking.findOne({ razorpayOrderId: razorpay_order_id });
            
            if (!booking) {
                return res.status(404).json({ message: 'Pending booking not found' });
            }

            if (booking.status === 'confirmed') {
                return res.status(400).json({ message: 'Booking already confirmed' });
            }

            const event = await Event.findById(eventId);
            if (!event || event.availableSeats <= 0) {
                 return res.status(400).json({ message: 'Event fully booked or not found.' });
            }

            // 🌟 NEW: Update the existing pending booking instead of creating a new one
            booking.status = 'confirmed';
            booking.paymentStatus = 'paid';
            booking.razorpayPaymentId = razorpay_payment_id;
            await booking.save();

            // Decrease available seats
            event.availableSeats -= 1;
            await event.save();

            // Send confirmation email
            await sendBookingEmail(req.user.email, req.user.name, event.title);

            res.status(200).json({ message: 'Payment verified successfully', booking });
        } else {
            res.status(400).json({ message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Razorpay Verify Payment Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
