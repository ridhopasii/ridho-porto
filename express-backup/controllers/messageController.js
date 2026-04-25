const repo = require('../services/repo');

// Public: Send Message
const sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: 'Nama, Email, dan Pesan wajib diisi!' });
    }

    const newMessage = await repo.createMessage({
      name,
      email,
      subject: subject || 'No Subject',
      message,
    });

    res.status(201).json({ success: true, message: 'Pesan berhasil dikirim!', data: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// Admin: Get All Messages
const getMessages = async (req, res) => {
  try {
    const messages = await repo.getMessages();

    // Pass to view (we will create views/admin/messages/index.ejs later)
    res.render('admin/messages/index', {
      title: 'Pesan Masuk',
      path: '/admin/messages',
      messages,
      user: req.user,
      layout: 'admin/layout', // Assuming layout structure
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Admin: Delete Message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await repo.deleteMessage(id, { accessToken: req.supabaseAccessToken });
    res.redirect('/admin/messages');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error delete message');
  }
};

module.exports = {
  sendMessage,
  getMessages,
  deleteMessage,
};
