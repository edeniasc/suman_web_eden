const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

mongoose.connect('mongodb+srv://edeniasc:Edenia05%21@cluster1sumanwebsite.ew0cywn.mongodb.net/mydb?retryWrites=true&w=majority&appName=cluster1sumanwebsite', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Terhubung ke MongoDB Atlas'))
.catch(err => {
  console.error('❌ Gagal konek MongoDB');
  console.error(err.message);
});

const User = mongoose.model('User', {
  name: String,
  email: String,
  message: String
});


app.get('/', (req, res) => {
  res.send('🎉 Backend berjalan!');
});

app.post('/users', async (req, res) => {
  const { name, email, message } = req.body;
  const user = new User({ name, email, message });
  await user.save();
  res.send('✅ User disimpan');
});


app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

const nodemailer = require('nodemailer');

// transporter setup (gunakan Gmail / SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yourgmail@gmail.com',
    pass: 'your_app_password' // bukan password biasa
  }
});

app.post('/users', async (req, res) => {
  const { name, email, message } = req.body;
  const user = new User({ name, email, message });
  await user.save();

  // send email
  const mailOptions = {
    from: 'yourgmail@gmail.com',
    to: email, // atau ke admin
    subject: `📩 Terima kasih atas pesanmu, ${name}`,
    text: `Halo ${name},\n\nKami telah menerima pesan Anda:\n"${message}"\n\nKami akan segera menghubungi Anda.\n\nSalam,\nTim SUMAN`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).send('❌ Gagal kirim email.');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('✅ User disimpan dan email dikirim');
    }
  });
});

