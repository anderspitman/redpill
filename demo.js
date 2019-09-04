import { Rainer } from './index.js';


const usernameInput = document.getElementById('username')
const submitInput = document.getElementById('submit')


let rainer;

submitInput.addEventListener('click', () => {
  const username = usernameInput.value;
  const root = document.getElementById('root');
  const oldElem = root.firstChild;
  root.removeChild(oldElem);
  go(username);
})

function go(username) {
  rainer = new Rainer({
    sourceType: 'github',
    githubUsername: username,
    domElementId: 'root',
  })
}

go(usernameInput.value);
