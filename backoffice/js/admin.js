(function () {
  const loginView = document.getElementById('loginView');
  const adminView = document.getElementById('adminView');

  function fmtDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }

  function showMsg(el, text, type) {
    el.textContent = text;
    el.className = `msg show ${type}`;
    setTimeout(() => { el.className = 'msg'; }, 5000);
  }

  async function loadSubscribers() {
    const tableLoading = document.getElementById('tableLoading');
    const tableWrap = document.getElementById('tableWrap');
    const body = document.getElementById('subscriberBody');
    const emptyState = document.getElementById('emptyState');

    tableLoading.style.display = 'block';
    tableWrap.style.display = 'none';

    try {
      const res = await fetch('/api/subscribers');
      if (res.status === 401 || res.status === 403) {
        location.reload();
        return;
      }
      const data = await res.json();
      const subs = data.subscribers || [];

      // 통계 업데이트
      document.getElementById('totalCount').textContent = data.total || 0;
      document.getElementById('referralTotal').textContent = subs.filter(s => s.referredBy).length;
      const today = new Date().toISOString().slice(0, 10);
      document.getElementById('todayCount').textContent = subs.filter(s => s.subscribedAt && s.subscribedAt.startsWith(today)).length;

      tableLoading.style.display = 'none';
      tableWrap.style.display = 'block';

      if (subs.length === 0) {
        body.innerHTML = '';
        emptyState.style.display = 'block';
        document.querySelector('#subscriberTable').style.display = 'none';
        return;
      }

      emptyState.style.display = 'none';
      document.querySelector('#subscriberTable').style.display = 'table';

      body.innerHTML = subs.map(s => {
        const inviteUrl = `${location.origin}/invite?ref=${s.inviteCode}`;
        return `<tr>
          <td class="email-cell">${escHtml(s.email)}</td>
          <td class="date-cell">${fmtDate(s.subscribedAt)}</td>
          <td class="ref-cell">${s.referredBy ? escHtml(s.referredBy) : '<span style="color:var(--text-dim)">—</span>'}</td>
          <td class="count-cell">${s.referralCount || 0}</td>
          <td>
            <button class="copy-btn" onclick="copyText('${escAttr(inviteUrl)}', this)" style="font-size:11px;">복사</button>
          </td>
          <td>
            <button class="btn btn-danger" onclick="deleteSub('${escAttr(s.email)}', this)">삭제</button>
          </td>
        </tr>`;
      }).join('');
    } catch (err) {
      tableLoading.innerHTML = `<p style="color:#f28b82;">불러오기 실패: ${err.message}</p>`;
    }
  }

  async function deleteSub(email, btn) {
    if (!confirm(`"${email}" 구독자를 삭제할까요?`)) return;
    btn.disabled = true;
    btn.textContent = '…';
    try {
      const res = await fetch(`/api/subscribers?email=${encodeURIComponent(email)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.ok) {
        loadSubscribers();
      } else {
        alert(data.error || '삭제 실패');
        btn.disabled = false;
        btn.textContent = '삭제';
      }
    } catch {
      alert('오류가 발생했습니다.');
      btn.disabled = false;
      btn.textContent = '삭제';
    }
  }

  async function sendDaily() {
    const btn = document.getElementById('sendBtn');
    const msgEl = document.getElementById('sendMsg');
    if (!confirm('지금 바로 오늘의 이메일을 전체 구독자에게 발송할까요?')) return;
    btn.disabled = true;
    btn.textContent = '발송 중…';
    msgEl.className = 'msg';

    try {
      const res = await fetch('/api/send-daily', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        showMsg(msgEl, `✅ 발송 완료 — ${data.sent}명 성공 / ${data.failed || 0}명 실패`, 'success');
      } else {
        showMsg(msgEl, `오류: ${data.error}`, 'error');
      }
    } catch {
      showMsg(msgEl, '발송 중 오류가 발생했습니다.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = '📨 오늘의 이메일 발송';
    }
  }

  document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('addEmail').value.trim();
    const msgEl = document.getElementById('addMsg');
    if (!email) return;

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        showMsg(msgEl, `✅ ${email} 추가 완료`, 'success');
        document.getElementById('addEmail').value = '';
        loadSubscribers();
      } else {
        showMsg(msgEl, data.error || '추가 실패', 'error');
      }
    } catch {
      showMsg(msgEl, '오류가 발생했습니다.', 'error');
    }
  });

  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function escAttr(s) {
    return String(s).replace(/'/g, '&#39;').replace(/"/g, '&quot;');
  }

  window.copyText = function (text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      const orig = btn.textContent;
      btn.textContent = '복사됨!';
      setTimeout(() => { btn.textContent = orig; }, 1500);
    });
  };

  window.deleteSub = deleteSub;
  window.sendDaily = sendDaily;
  window.loadSubscribers = loadSubscribers;

  // 인증 상태 확인 후 화면 전환
  (async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated) {
        document.getElementById('adminUser').textContent = `@${data.user}`;
        adminView.style.display = 'block';
        loadSubscribers();
      } else {
        loginView.style.display = 'block';
      }
    } catch {
      loginView.style.display = 'block';
    }
  })();
})();
