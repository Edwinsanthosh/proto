const BACKEND_URL = 'https://192.168.23.250:5000/api/claim';
const el = id => document.getElementById(id);

const claimBtn = el('claimBtn');
const getLocBtn = el('getLocBtn');
const statusEl = el('status');
const geoBlocker = el('geoBlocker');

function setStatus(msg){ statusEl.textContent = msg }

// Check geolocation permission
async function checkGeoPermission() {
  if (!navigator.permissions) return true;
  try {
    const status = await navigator.permissions.query({ name: 'geolocation' });
    if (status.state === 'denied') {
      geoBlocker.style.display = 'flex';
      claimBtn.disabled = true;
      getLocBtn.disabled = true;
      setStatus('Enable location in browser settings.');
      return false;
    }
    return true;
  } catch(err){ return true; }
}

// Get user location
function getLocation(timeout=8000){
  return new Promise(resolve=>{
    if(!navigator.geolocation) return resolve({available:false});
    let done=false;
    const timer = setTimeout(()=>{ if(!done){ done=true; resolve({available:false,error:'timeout'}) }}, timeout);
    navigator.geolocation.getCurrentPosition(
      pos => { if(done) return; done=true; clearTimeout(timer); resolve({available:true,latitude:pos.coords.latitude,longitude:pos.coords.longitude,accuracy:pos.coords.accuracy}) },
      err => { if(done) return; done=true; clearTimeout(timer); resolve({available:false,error:err.message}) },
      { enableHighAccuracy:true, maximumAge:60000, timeout:7000 }
    );
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', async ()=>{
  const allowed = await checkGeoPermission();
  if(allowed) setStatus('Tap "Get My Location" to proceed.');
});

getLocBtn.addEventListener('click', async ()=>{
  setStatus('Fetching location...');
  const loc = await getLocation();
  if(loc.available){
    setStatus(`Location captured: lat:${loc.latitude.toFixed(3)}, lng:${loc.longitude.toFixed(3)}`);
  } else {
    setStatus('Failed to get location. Enable browser location.');
  }
});

// Form submission
el('promoForm').addEventListener('submit', async e=>{
  e.preventDefault();
  claimBtn.disabled = true;
  setStatus('Preparing your coupon...');

  const name = el('name').value.trim();
  const email = el('email').value.trim();
  const phone = el('phone').value.trim();
  const message = el('message').value.trim();
  const consent = el('consent').checked;

  if(!consent){ setStatus('Consent required.'); claimBtn.disabled=false; return; }

  setStatus('Requesting location...');
  const location = await getLocation();

  const payload = {name,email,phone,message,consent,location};

  try {
    setStatus('Sending claim to server...');
    const res = await fetch(BACKEND_URL, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if(!res.ok) throw new Error(await res.text() || 'Server error');

    const data = await res.json().catch(()=>({code:Math.random().toString(36).slice(2,9).toUpperCase()}));
    const code = data.code || Math.random().toString(36).slice(2,9).toUpperCase();
    setStatus(`Success! Your coupon code is: ${code}`);
    el('promoForm').reset();
  } catch(err) {
    console.error(err);
    setStatus('Failed to send claim. Please try again.');
  } finally {
    claimBtn.disabled = false;
  }
});

// Privacy policy click
el('pp-link').addEventListener('click', e=>{
  e.preventDefault();
  alert('Privacy: Your details are only used to send the coupon. You can request deletion anytime.');
});
