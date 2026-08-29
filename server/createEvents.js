const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');

dotenv.config();

const events = [
    {
        title: 'AI & Machine Learning Summit 2026',
        description: 'Join 500+ developers, researchers, and tech leaders for a deep dive into the latest breakthroughs in Artificial Intelligence, Large Language Models, and Machine Learning. Featuring hands-on workshops, live demos, and networking sessions with industry pioneers from Google, OpenAI, and Microsoft.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        location: 'Pragati Maidan, New Delhi',
        category: 'Technology',
        totalSeats: 500,
        ticketPrice: 999,
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Bollywood Music Night - Live Concert',
        description: 'Experience an electrifying evening of Bollywood hits performed live by top playback singers and musicians. From classic melodies to the latest chartbusters, this concert promises an unforgettable night of music, dance, and entertainment under the stars.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        location: 'JLN Stadium, New Delhi',
        category: 'Music',
        totalSeats: 2000,
        ticketPrice: 1500,
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Startup India Pitch Competition',
        description: 'Watch 30 of India\'s most promising startups pitch their ideas to a panel of top VCs and angel investors. Winner takes home ₹25 Lakhs in seed funding! Great opportunity for entrepreneurs, investors, and anyone passionate about the Indian startup ecosystem.',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        location: 'ITC Grand Chola, Chennai',
        category: 'Business',
        totalSeats: 300,
        ticketPrice: 500,
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Contemporary Art Exhibition - Canvas & Beyond',
        description: 'Discover breathtaking contemporary artworks from 50+ emerging and established Indian artists. This curated exhibition features paintings, sculptures, digital art installations, and interactive experiences that push the boundaries of modern art.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        location: 'National Gallery of Modern Art, Mumbai',
        category: 'Art',
        totalSeats: 200,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Full Stack Web Development Bootcamp',
        description: 'An intensive 2-day bootcamp covering React, Node.js, MongoDB, and deployment on AWS. Build a complete production-ready application from scratch. Perfect for developers looking to level up their skills with hands-on mentorship from senior engineers.',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        location: 'WeWork, Cyber Hub, Gurugram',
        category: 'Technology',
        totalSeats: 100,
        ticketPrice: 2499,
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'
    }
];

const createEvents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Database Connected\n');

        // Find admin user
        const admin = await User.findOne({ email: 'odomon188@gmail.com', role: 'admin' });
        
        if (!admin) {
            console.log('❌ Admin account (odomon188@gmail.com) nahi mila ya role admin nahi hai!');
            process.exit(1);
        }
        
        console.log(`👑 Admin found: ${admin.name} (${admin.email})\n`);

        // Create events linked to admin
        const eventsWithAdmin = events.map(e => ({
            ...e,
            availableSeats: e.totalSeats,
            createdBy: admin._id
        }));

        const created = await Event.insertMany(eventsWithAdmin);
        
        console.log(`🎉 ${created.length} Events successfully created!\n`);
        created.forEach((e, i) => {
            console.log(`   ${i+1}. 🎪 ${e.title}`);
            console.log(`      📍 ${e.location}`);
            console.log(`      💺 Seats: ${e.totalSeats}`);
            console.log(`      💰 Price: ${e.ticketPrice === 0 ? 'FREE' : '₹' + e.ticketPrice}`);
            console.log('');
        });

        console.log('✅ Ab website refresh karo - saare events dikh jayenge!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

createEvents();
