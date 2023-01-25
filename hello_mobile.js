/**
 * in mobile view user is greeted by greetingpage for 3 seconds,
 * it gets the data and renders the topper and footer,
 * it gets the name of the user and greets the user,
 * after 3 seconds redirected to summary.html
 */
async function renderGreetingHello(){
    await init();
    renderWithoutActiveSection();
    document.getElementById('greeting-time-hello').innerText = getDaytimeGreeting();
    if(activeUser != 'Guest'){
        document.getElementById('greeting-name-mobile').innerText = activeUser;
    }
    setTimeout(() =>{
        window.location.href = 'summary.html';
    }, 3000);
}