import { Rainer } from 'make-it-rain';


const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const submitInput = document.getElementById('submit')


submitInput.addEventListener('click', () => {
  const username = usernameInput.value
  const password = passwordInput.value

  const rainer = new Rainer({
    sourceType: 'github',
    githubUsername: username,
    githubPassword: password,
    domElementId: 'root',
    fileTypes: ['js', 'json', 'md', 'ts']
  })

})
