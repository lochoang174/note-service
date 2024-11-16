const amqplib = require('amqplib');
const Note = require('../models/Note');
const Sharing = require('../models/Sharing');
const amqp_url_docker = 'amqp://rabbitmq:5672';  // Use the correct RabbitMQ container hostname

const receiveQueue = async () => {
  try {
    const conn = await amqplib.connect(amqp_url_docker);

    const channel = await conn.createChannel();

    const signupQueue = 'signup_queue';
    const acceptQueue = 'accept_queue';

    // Assert the queues
    await channel.assertQueue(signupQueue, { durable: false });
    // Consume from signup queue
    channel.consume(signupQueue, async (msg) => {
      if (msg !== null) {
        console.log("Received message from signup_queue:", msg.content.toString());

        const userId = msg.content.toString(); // assuming payload is a string (you can adjust according to actual payload structure)
        
        try {
          // Create Notes for user
          await Note.create({ title: 'Store important information ', content: 'Detailed content of the important note.', owner: userId, status: '1' });
          await Note.create({ title: 'Store important code', content: 'Code snippet or description of the code-related note.', owner: userId, status: '1' });
          await Note.create({ title: 'Store urgent information', content: 'Detailed content of the urgent note.', owner: userId, status: '1' });

          // Create Sharing
          await Sharing.create({ account: userId, notes: [] });

          console.log('Note and Sharing created successfully for user:', userId);
          
          // Acknowledge the message
        } catch (err) {
          console.error('Error processing message:', err);
          // If you don't want to ack on failure, you can nack or requeue
        }
      }
    }, { noAck: true });

    console.log('Waiting for messages...');
  } catch (error) {
    console.error('Error:', error);
  }
};


module.exports = receiveQueue;
