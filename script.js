// Function to generate a unique ID
function generateUniqueId(role) {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const year = new Date().getFullYear();
    
    let rolePrefix;
    switch(role) {
        case 'AlphaEdger':
            rolePrefix = 'ALP';
            break;
        case 'EdgeCommander':
            rolePrefix = 'CMD';
            break;
        case 'MemEdge':
            rolePrefix = 'MEM';
            break;
        case 'EdgeDevs':
            rolePrefix = 'DEV';
            break;
        case 'EdgeChamps':
            rolePrefix = 'CHP';
            break;
        case 'EdgeMod':
            rolePrefix = 'MOD';
            break;
        case 'EDGEN':
            rolePrefix = 'EDG';
            break;
        default:
            rolePrefix = 'MEM';
    }
    
    const sequence = timestamp.toString().slice(-4);
    return `${rolePrefix}-${year}-${sequence}-${random}`;
}

// Function to get current date in a formatted string
function getCurrentDate() {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

// Function to handle file upload
function handleFileUpload(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve('layer-icon.jpg');
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            reject('Invalid file type');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        reader.onerror = () => {
            reject('Error reading file');
        };
        reader.readAsDataURL(file);
    });
}

// Function to update the ID card with member data
async function updateIDCard(formData) {
    const idCard = document.querySelector('.id-card');
    idCard.className = 'id-card animate';
    idCard.classList.add(`theme-${formData.theme}`, `template-${formData.template}`);
    
    document.getElementById('member-name').textContent = formData.name;
    document.getElementById('member-id').textContent = formData.id;
    document.getElementById('member-role').textContent = formData.role;
    document.getElementById('member-email').textContent = formData.email;
    document.getElementById('join-date').textContent = formData.joinDate;
    document.getElementById('member-status').textContent = 'Active';
    
    const profilePic = document.getElementById('profile-pic');
    profilePic.src = formData.profilePicture || 'layer-icon.jpg';
    
    const qrCode = new QRCode(document.getElementById('qrCode'), {
        text: `https://x.com/${formData.xUsername}`,
        width: 90,
        height: 90
    });
}

// Function to update the live preview
function updatePreview() {
    const name = document.getElementById('name').value || 'John Doe';
    const role = document.getElementById('role').value || 'AlphaEdger';
    const file = document.getElementById('profilePicture').files[0];
    const theme = document.getElementById('cardTheme').value;
    const template = document.getElementById('cardTemplate').value;
    
    const previewCard = document.querySelector('.id-card-preview');
    previewCard.className = 'id-card-preview';
    previewCard.classList.add(`theme-${theme}`, `template-${template}`);
    
    document.getElementById('preview-member-name').textContent = name;
    document.getElementById('preview-member-role').textContent = role;
    document.getElementById('preview-member-id').textContent = generateUniqueId(role);
    
    if (file) {
        handleFileUpload(file).then(src => {
            document.getElementById('preview-profile-pic').src = src;
        });
    }
}

// Function to switch pages
function switchPage(fromPage, toPage) {
    fromPage.classList.remove('active');
    toPage.classList.add('active');
}

// Function to add ripple effect on button click
function addRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${e.clientX - button.offsetLeft - radius}px`;
    ripple.style.top = `${e.clientY - button.offsetTop - radius}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// Handle proceed button click
document.getElementById('proceedToForm').addEventListener('click', function(e) {
    addRippleEffect(e);
    const landingPage = document.getElementById('landingPage');
    const formPage = document.getElementById('formPage');
    switchPage(landingPage, formPage);
});

// Handle file input change
document.getElementById('profilePicture').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const fileName = file ? file.name : 'No file chosen';
    document.querySelector('.file-name').textContent = fileName;
    updatePreview();
});

// Handle form submission
document.getElementById('idCardForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitButton = this.querySelector('.generate-btn');
    const originalButtonText = submitButton.innerHTML;
    const formPage = document.getElementById('formPage');
    const idCardPage = document.getElementById('idCardPage');
    
    try {
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        submitButton.innerHTML = `
            <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span>Generating...</span>
        `;

        const file = document.getElementById('profilePicture').files[0];
        const profilePicture = await handleFileUpload(file);
        const role = document.getElementById('role').value;
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            xUsername: document.getElementById('xUsername').value,
            role: role,
            profilePicture: profilePicture,
            id: generateUniqueId(role),
            joinDate: getCurrentDate(),
            theme: document.getElementById('cardTheme').value,
            template: document.getElementById('cardTemplate').value
        };
        
        await updateIDCard(formData);
        
        setTimeout(() => {
            switchPage(formPage, idCardPage);
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }, 500);
        
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error generating your ID card. Please try again.');
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});

// Handle retweet button click
document.getElementById('retweetCard').addEventListener('click', function(e) {
    addRippleEffect(e);
    const memberName = document.getElementById('member-name').textContent;
    const memberId = document.getElementById('member-id').textContent;
    const memberRole = document.getElementById('member-role').textContent;
    const xUsername = document.getElementById('xUsername').value;
    
    const tweetText = `I just joined the LayerEdge EDGEN community as a ${memberRole}! 🎉\n\nMy EDGEN ID: ${memberId}\n\nJoin me at @EDGEN_Community #EDGENCommunity`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank');
});

// Handle back button clicks
function handleBackToForm() {
    const formPage = document.getElementById('formPage');
    const idCardPage = document.getElementById('idCardPage');
    switchPage(idCardPage, formPage);
}

document.getElementById('backToFormHeader').addEventListener('click', function(e) {
    addRippleEffect(e);
    handleBackToForm();
});
document.getElementById('backToFormFooter').addEventListener('click', function(e) {
    addRippleEffect(e);
    handleBackToForm();
});

// Handle live preview updates
document.getElementById('name').addEventListener('input', updatePreview);
document.getElementById('role').addEventListener('change', updatePreview);
document.getElementById('cardTheme').addEventListener('change', updatePreview);
document.getElementById('cardTemplate').addEventListener('change', updatePreview);

// Handle theme toggle
document.getElementById('themeToggle').addEventListener('click', function(e) {
    addRippleEffect(e);
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Add hover effect to the ID card
const idCard = document.querySelector('.id-card');
idCard.addEventListener('mouseenter', () => {
    idCard.style.transform = 'translateY(-5px)';
});
idCard.addEventListener('mouseleave', () => {
    idCard.style.transform = 'translateY(0)';
});

// Initialize preview
updatePreview();