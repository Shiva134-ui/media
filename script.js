const messagesDiv = document.getElementById("messages");
const downArrow = document.getElementById('down-arrow');

downArrow.addEventListener('click', () => {
    messagesDiv.scrollTop = messagesDiv.scrollHeight; 
});