import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Service'
    },
    plan: {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    bookingDate: {
        type: Date,
        required: true
    },
    bookingTime: {
        type: String,
        required: true
    }, // Added to match frontend time slots
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    notes: {
        type: String
    },
    // Added Review section
    review: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: {
            type: String
        },
        vendorReply: {
            type: String
        },
        reviewedAt: {
            type: Date
        }
    }
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
