const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name')?.value?.trim() || '';
    const phone = document.getElementById('phone')?.value?.trim() || '';
    const time = document.getElementById('time')?.value?.trim() || '';

    if (!name || !phone) {
      if (status) {
        status.textContent = 'Iltimos, ism va telefon raqamni to‘ldiring.';
      }
      return;
    }

    if (status) {
      status.textContent = 'Yuborilmoqda...';
    }

    try {
      // GET so‘rov yuborish
      const response = await fetch(
        `https://turdibekbarber-botfull.onrender.com/send-contact?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&time=${encodeURIComponent(time)}&type=Bron&message=Bron%20qilish%20formasi`
      );

      const data = await response.json();

      if (response.ok && data.ok) {
        if (status) {
          status.textContent = data.message || 'Murojaatingiz muvaffaqiyatli yuborildi.';
        }
        form.reset();
      } else {
        if (status) {
          status.textContent = data.message || 'Yuborishda xatolik yuz berdi.';
        }
      }
    } catch (error) {
      console.error('Form yuborishda xato:', error);
      if (status) {
        status.textContent = 'Server bilan bog‘lanishda xatolik yuz berdi.';
      }
    }
  });
}
