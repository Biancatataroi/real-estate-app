// --- State & DOM refs (in the same order) ---
const sections = {};
[
  'login','dashboard',
  'addProp','deleteProp','sortPrice','sortArea',
  'auctionBuy','auctionRent',
  'mortgage','investment','risk','eligibility',
  'sortROI','yield','tax','amort','forecast'
].forEach(name => {
  sections[name] = document.getElementById(name + 'Section');
});

// --- Hard-coded users for login ---
const usersList = [
  { u: 'admin',  p: 'admin123' },
  { u: 'bianca', p: 'secret'    }
];

// Login controls
const loginBtn   = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const userLabel  = document.getElementById('userLabel');


// --- Utility to switch views ---
function showSection(key) {
  Object.values(sections).forEach(s => s.classList.remove('active'));
  sections[key].classList.add('active');
}

// --- 0) Login handler ---
loginBtn.addEventListener('click', () => {
  const u = document.getElementById('username').value;
  const p = document.getElementById('password').value;
  if (usersList.find(x => x.u === u && x.p === p)) {
    sessionStorage.setItem('user', u);
    userLabel.textContent = u;
    loginError.textContent = '';
    showSection('dashboard');
  } else {
    loginError.textContent = 'Invalid username or password.';
  }
});

// 1) Add property
document.getElementById('addProperty').addEventListener('click', () => {
  const p = {
    name   : document.getElementById('p_name').value,
    invAmt : +document.getElementById('p_invAmt').value,
    expRet : +document.getElementById('p_expRet').value,
    years  : +document.getElementById('p_years').value,
    area   : +document.getElementById('p_area').value,
    price  : +document.getElementById('p_price').value
  };
  properties.push(p);
  document.getElementById('addPropResult').textContent =
    `Added "${p.name}". Total props: ${properties.length}`;
});

// 2) Delete property
document.getElementById('deleteProperty').addEventListener('click', () => {
  const idx = +document.getElementById('del_index').value - 1;
  if (idx >= 0 && idx < properties.length) {
    const removed = properties.splice(idx, 1)[0];
    document.getElementById('deletePropResult').textContent =
      `Removed "${removed.name}".`;
  } else {
    document.getElementById('deletePropResult').textContent =
      'Invalid index.';
  }
});

// 3) Sort by price
document.getElementById('doSortPrice').addEventListener('click', () => {
  const sorted = properties.slice().sort((a, b) => a.price - b.price);
  let html = '<ol>';
  sorted.forEach(p => html += `<li>${p.name}: ${p.price}</li>`);
  html += '</ol>';
  document.getElementById('sortPriceResult').innerHTML = html;
});

// 4) Sort by area
document.getElementById('doSortArea').addEventListener('click', () => {
  const sorted = properties.slice().sort((a, b) => a.area - b.area);
  let html = '<ol>';
  sorted.forEach(p => html += `<li>${p.name}: ${p.area}</li>`);
  html += '</ol>';
  document.getElementById('sortAreaResult').innerHTML = html;
});

// 5) Auction buy
document.getElementById('calcAuctionBuy').addEventListener('click', () => {
  const base = +document.getElementById('ab_base').value;
  const cond = +document.getElementById('ab_condition').value;
  const zone = +document.getElementById('ab_zone').value;
  const price = base * cond * zone;
  document.getElementById('auctionBuyResult').textContent =
    `Buy Price: ${price.toFixed(2)}`;
});

// 6) Auction rent
document.getElementById('calcAuctionRent').addEventListener('click', () => {
  const buy  = +document.getElementById('ar_buyPrice').value;
  const coef = +document.getElementById('ar_rentCoef').value;
  const rent = buy * coef;
  document.getElementById('auctionRentResult').textContent =
    `Rent Price: ${rent.toFixed(2)}`;
});

// 7) Mortgage
document.getElementById('calcMortgage').addEventListener('click', () => {
  const inc  = +document.getElementById('m_income').value;
  const loan = +document.getElementById('m_loanAmt').value;
  const r    = +document.getElementById('m_annualRate').value / 1200;
  const n    = +document.getElementById('m_termYears').value * 12;
  const pay  = n > 0 ? (loan * r) / (1 - Math.pow(1 + r, -n)) : 0;
  const ok   = pay <= inc * 0.4;
  document.getElementById('mortgageResult').innerHTML =
    `<p>Payment: ${pay.toFixed(2)}<br>${ok ? '✅' : '❌'}</p>`;
});

// 8) Investment
document.getElementById('calcInvestment').addEventListener('click', () => {
  const amt = +document.getElementById('i_amount').value;
  const r   = +document.getElementById('i_annualRet').value / 100;
  const y   = +document.getElementById('i_years').value;
  const fv  = amt * Math.pow(1 + r, y);
  document.getElementById('investmentResult').textContent =
    `Future Value: ${fv.toFixed(2)}`;
});

// 9) Risk analysis
document.getElementById('calcRisk').addEventListener('click', () => {
  const r = +document.getElementById('r_annualRet').value;
  const y = +document.getElementById('r_years').value;
  const score = (y > 0) ? (r / y).toFixed(2) : '∞';
  document.getElementById('riskResult').textContent =
    `Risk Score: ${score}`;
});

// 10) Loan eligibility
document.getElementById('checkEligibility').addEventListener('click', () => {
  const inc  = +document.getElementById('e_income').value;
  const loan = +document.getElementById('e_loanAmt').value;
  const r    = +document.getElementById('e_annualRate').value / 1200;
  const n    = +document.getElementById('e_termYears').value * 12;
  const pay  = n > 0 ? (loan * r) / (1 - Math.pow(1 + r, -n)) : 0;
  const ok   = pay <= inc * 0.4;
  document.getElementById('eligibilityResult').textContent =
    ok ? 'Eligible ✅' : 'Not eligible ❌';
});

// 11) Sort ROI
document.getElementById('doSortROI').addEventListener('click', () => {
  properties.forEach(p => {
    p.roi = ((Math.pow(1 + p.expRet / 100, p.years) - 1) * 100);
  });
  const sorted = properties.slice().sort((a, b) => b.roi - a.roi);
  let html = '<ol>';
  sorted.forEach(p => html += `<li>${p.name}: ${p.roi.toFixed(2)}%</li>`);
  html += '</ol>';
  document.getElementById('sortROIResult').innerHTML = html;
});

// 12) Invest yield
document.getElementById('calcYield').addEventListener('click', () => {
  const yields = properties.map(p =>
    ((p.expRet / p.invAmt) * 100).toFixed(2)
  );
  document.getElementById('yieldResult').innerHTML =
    yields.length
      ? '<ol>' + yields.map((y, i) => `<li>${properties[i].name}: ${y}%</li>`).join('') + '</ol>'
      : 'No properties added';
});

// 13) Tax
document.getElementById('calcTax').addEventListener('click', () => {
  const price = +document.getElementById('t_price').value;
  const rate  = +document.getElementById('t_rate').value / 100;
  const tax   = price * rate;
  document.getElementById('taxResult').textContent =
    `Tax: ${tax.toFixed(2)}`;
});

// 14) Amortization schedule
document.getElementById('genAmort').addEventListener('click', () => {
  const loan = +document.getElementById('am_price').value;
  const r    = +document.getElementById('am_rate').value / 1200;
  const n    = +document.getElementById('am_term').value * 12;
  const pay  = n > 0 ? (loan * r) / (1 - Math.pow(1 + r, -n)) : 0;
  let bal = loan;
  let html = '<table><tr><th>#</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>';
  for (let i = 1; i <= n; i++) {
    const interest  = bal * r;
    const principal = pay - interest;
    bal -= principal;
    html += `<tr><td>${i}</td><td>${pay.toFixed(2)}</td><td>${principal.toFixed(2)}</td><td>${interest.toFixed(2)}</td><td>${bal.toFixed(2)}</td></tr>`;
    if (i >= 36) break;
  }
  html += '</table>';
  document.getElementById('amortResult').innerHTML = html;
});

// 15) Forecast
document.getElementById('genForecast').addEventListener('click', () => {
  let price = +document.getElementById('f_current').value;
  const rate   = +document.getElementById('f_rate').value;
  const months = +document.getElementById('f_months').value;
  let html  = '<table><tr><th>Month</th><th>Price</th></tr>';
  for (let m = 1; m <= months; m++) {
    price *= (1 + rate);
    html += `<tr><td>${m}</td><td>${price.toFixed(2)}</td></tr>`;
  }
  html += '</table>';
  document.getElementById('forecastResult').innerHTML = html;
});

// --- LOGOUT & NAV ---
document.getElementById('logoutLink').addEventListener('click', () => {
  sessionStorage.clear();
  showSection('login');
});
document.querySelectorAll('a[data-show]').forEach(a => {
  a.addEventListener('click', () => {
    showSection(a.getAttribute('data-show').replace('Section',''));
  });
});

// --- SESSION restore on reload ---
document.addEventListener('DOMContentLoaded', () => {
  const storedUser = sessionStorage.getItem('user');
  if (storedUser) {
    userLabel.textContent = storedUser;
    showSection('dashboard');
  }
});

// --- global storage for properties ---
let properties = [];
