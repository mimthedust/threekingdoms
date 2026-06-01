(function () {
  // URL에서 ref 코드 읽기
  const params = new URLSearchParams(location.search);
  const ref = params.get('ref');
  if (ref) document.getElementById('refCode').value = ref;

  const form = document.getElementById('subscribeForm');
  const btnText = document.getElementById('btnText');
  const btnSpinner = document.getElementById('btnSpinner');
  const submitBtn = document.getElementById('submitBtn');
  const msg = document.getElementById('msg');
  const inviteBox = document.getElementById('inviteBox');
  const inviteUrlEl = document.getElementById('inviteUrl');

  function showMsg(text, type) {
    msg.textContent = text;
    msg.className = `msg show ${type}`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    if (!email) return;

    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnSpinner.style.display = 'inline-block';
    msg.className = 'msg';

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ref: document.getElementById('refCode').value || undefined }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        showMsg(data.message, 'success');
        form.reset();

        if (data.inviteCode) {
          const inviteUrl = `${location.origin}/invite?ref=${data.inviteCode}`;
          inviteUrlEl.textContent = inviteUrl;
          inviteBox.style.display = 'block';
        }
      } else {
        showMsg(data.error || '오류가 발생했습니다.', 'error');
      }
    } catch {
      showMsg('네트워크 오류가 발생했습니다. 다시 시도해주세요.', 'error');
    } finally {
      submitBtn.disabled = false;
      btnText.style.display = '';
      btnSpinner.style.display = 'none';
    }
  });

  window.copyInvite = function () {
    const url = inviteUrlEl.textContent;
    navigator.clipboard.writeText(url).then(() => {
      showMsg('초대 링크가 복사되었습니다!', 'info');
    });
  };
})();
