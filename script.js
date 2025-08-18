// Body parts mapping
const bodyParts = [
    { id: 'head', name: 'মাথা', x: 50, y: 4, radius: 10 },
    { id: 'chest', name: 'বুক', x: 50, y: 21, radius: 12 },
    { id: 'belly', name: 'পেট', x: 50, y: 36, radius: 10 },
    { id: 'leftHand', name: 'বাম হাত', x: 25, y: 36, radius: 6 },
    { id: 'rightHand', name: 'ডান হাত', x: 75, y: 36, radius: 6 },
    { id: 'leftLeg', name: 'বাম পা', x: 40, y: 61, radius: 8 },
    { id: 'rightLeg', name: 'ডান পা', x: 60, y: 61, radius: 8 },
    { id: 'pelvis', name: 'শ্রোণী', x: 50, y: 49, radius: 8 }
];

// Symptoms data
const symptomsData = {
    head: ['মাথাব্যথা', 'মাথা ঘোরা', 'জ্বর', 'মাইগ্রেন'],
    chest: ['বুক ধড়ফড়', 'বুক ব্যথা', 'শ্বাসকষ্ট', 'হৃদস্পন্দন অনিয়মিত'],
    belly: ['পেটে ব্যথা', 'বমি বমি ভাব', 'গ্যাস্ট্রিক', 'পেট ফাঁপা'],
    leftHand: ['হাতে ব্যথা', 'হাত ফুলে যাওয়া', 'হাত অবশ হওয়া'],
    rightHand: ['হাতে ব্যথা', 'হাত ফুলে যাওয়া', 'হাত অবশ হওয়া'],
    leftLeg: ['পায়ে ব্যথা', 'পা ফুলে যাওয়া', 'পা অবশ হওয়া'],
    rightLeg: ['পায়ে ব্যথা', 'পা ফুলে যাওয়া', 'পা অবশ হওয়া'],
    pelvis: ['কোমরে ব্যথা', 'শ্রোণীতে ব্যথা', 'কোমর শক্ত হওয়া']
};

// === Utility to play audio file ===
function playAudio(file) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(file);
        audio.onended = resolve;
        audio.onerror = reject;
        audio.play().catch(reject);
    });
}

// === Welcome audio sequence ===
async function playWelcomeSequence() {
    await playAudio("welcome.mp3");
    await playAudio("instruction.mp3");
    await playAudio("select-part.mp3");
}

// === Show Symptoms with voice ===
async function showSymptoms(partId, partName) {
    const modal = document.getElementById('symptomModal');
    const modalTitle = document.getElementById('modal-title');
    const symptomList = document.getElementById('symptom-list');
    
    modalTitle.textContent = `${partName}-এর সমস্যা`;
    symptomList.innerHTML = '';
    
    const symptoms = symptomsData[partId] || ['এই অংশের জন্য কোনো তথ্য নেই।'];
    
    symptoms.forEach(symptom => {
        const item = document.createElement('div');
        item.className = 'symptom-item';
        item.textContent = symptom;
        item.addEventListener('click', async function() {
            modal.style.display = 'none';
            await playAudio("processing.mp3"); // "অনুগ্রহ করে অপেক্ষা করুন"
            await diagnoseDisease(symptom);
        });
        symptomList.appendChild(item);
    });
    
    modal.style.display = 'block';
    await playAudio("select-part.mp3");
}

// === Disease diagnosis function ===
async function diagnoseDisease(symptom) {
    const diagnosis = {
        'মাথাব্যথা': 'diagnosis-result.mp3',
        'বুক ব্যথা': 'diagnosis-result.mp3',
        'পেটে ব্যথা': 'diagnosis-result.mp3'
    };
    
    const file = diagnosis[symptom] || "diagnosis-result.mp3";
    await new Promise(resolve => setTimeout(resolve, 2000)); // fake delay
    await playAudio(file);
}

// === Page initialization ===
document.addEventListener('DOMContentLoaded', function() {
    // Ask user to start audio
    const permissionBox = document.createElement('div');
    permissionBox.style.position = "fixed";
    permissionBox.style.top = "0";
    permissionBox.style.left = "0";
    permissionBox.style.width = "100%";
    permissionBox.style.height = "100%";
    permissionBox.style.background = "rgba(0,0,0,0.7)";
    permissionBox.style.display = "flex";
    permissionBox.style.justifyContent = "center";
    permissionBox.style.alignItems = "center";
    permissionBox.style.zIndex = "1000";

    const btn = document.createElement('button');
    btn.textContent = "🔊 Start Voice";
    btn.style.padding = "15px 30px";
    btn.style.fontSize = "20px";
    btn.style.border = "none";
    btn.style.borderRadius = "10px";
    btn.style.background = "#4361ee";
    btn.style.color = "white";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";

    btn.onclick = async () => {
        permissionBox.remove();
        await playWelcomeSequence();
    };

    permissionBox.appendChild(btn);
    document.body.appendChild(permissionBox);

    // === Body image hotspot mapping ===
    const bodyImage = document.getElementById('bodyImage');
    const hotspotsContainer = document.getElementById('hotspots');
    const modal = document.getElementById('symptomModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.onclick = function() {
        modal.style.display = "none";
    };
    
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
    
    bodyImage.onload = function() {
        const imgWidth = bodyImage.offsetWidth;
        const imgHeight = bodyImage.offsetHeight;
        
        hotspotsContainer.innerHTML = '';
        
        bodyParts.forEach(part => {
            const hotspot = document.createElement('div');
            hotspot.className = 'hotspot';
            hotspot.style.width = `${(part.radius / 50) * imgWidth}px`;
            hotspot.style.height = `${(part.radius / 50) * imgWidth}px`;
            hotspot.style.left = `${(part.x / 100) * imgWidth}px`;
            hotspot.style.top = `${(part.y / 100) * imgHeight}px`;
            hotspot.title = part.name;
            
            hotspot.addEventListener('click', (e) => {
                e.stopPropagation();
                showSymptoms(part.id, part.name);
            });
            
            hotspotsContainer.appendChild(hotspot);
        });
    };
    
    if (bodyImage.complete) {
        bodyImage.onload();
    }
});
