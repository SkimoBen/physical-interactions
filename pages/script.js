window.onload = function () {
    const header = document.querySelector('header h1');
    header.style.opacity = '0';
    header.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        header.style.transition = 'all 1s ease-out';
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }, 200);
};
