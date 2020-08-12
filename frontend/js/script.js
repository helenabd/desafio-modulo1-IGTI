let globalUsers = [];
let filterUsers = [];

async function start() {
  await fetchUsers();

  hideSpinner();
  configFilter();
  //   renderUser();
  //   renderStatistics();
}

async function fetchUsers() {
  const resource = await fetch('http://localhost:3003/users');
  const json = await resource.json();

  globalUsers = json.map(({ name, picture, dob, gender }) => {
    return {
      userName: `${name.first} ${name.last}`,
      userPicture: picture.large,
      userAge: dob.age,
      userGender: gender,
    };
  });

  filterUsers = [...globalUsers];
}

function hideSpinner() {
  // pegar o elemento
  const spinner = document.querySelector('#spinner');

  // A classe hide faz parte do materialize
  spinner.classList.add('hide');
}

function renderUser() {
  const divUsers = document.querySelector('#users');

  divUsers.innerHTML = `
    <div class = 'row'>
        <h4>${filterUsers.length} usuário(s) encontrado(s)</h4>
        ${filterUsers
          .map(({ userPicture, userName, userAge }) => {
            return `
                
                <div class = 'flex-row'>
                    <img class = 'avatar' src = '${userPicture}' alt = '${userName}' />
                    <span class = 'users'>${userName}, ${userAge} anos</span><br>
                </div>
            `;
          })
          .join('')}
    </div>
  `;
}

function renderStatistics() {
  const divStatistics = document.querySelector('#statistics');

  const countMale = filterUsers.reduce(
    (accumulator, currentItem) =>
      currentItem.userGender === 'male' ? ++accumulator : accumulator,
    0
  );

  const countFemale = filterUsers.reduce(
    (accumulator, currentItem) =>
      currentItem.userGender === 'female' ? ++accumulator : accumulator,
    0
  );

  const allAges = filterUsers.reduce(
    (accumulator, currentItem) => (accumulator += currentItem.userAge),
    0
  );

  const avarageAges = allAges / filterUsers.length;

  divStatistics.innerHTML = `
    <div class = 'column'>
        <h4>Estatística</h4>
        <span>Sexo masculino: ${countMale}</span><br>
        <span>Sexo feminino: ${countFemale}</span><br>
        <span>Soma das idades: ${allAges}</span><br>
        <span>Média das idades: ${avarageAges.toFixed(2)}</span><br>

    </div>
  `;
}

function configFilter() {
  const buttonSearch = document.querySelector('#buttonSearch');
  buttonSearch.addEventListener('click', () => {
    const inputSearch = document.querySelector('#inputSearch');
    const filterValue = inputSearch.value.toLowerCase().trim();

    filterUsers = globalUsers.filter((item) => {
      return item.userName.toLowerCase().includes(filterValue);
    });

    //   buttonSearch.addEventListener('keyup', () => {
    //       const key = keyUp;
    //     inputSearch = document.querySelector('#inputSearch');
    //     filterValue = inputSearch.value.toLowerCase().trim();

    //     filterUsers = globalUsers.filter((item) => {
    //       return item.userName.toLowerCase().includes(filterValue);
    //     });

    renderUser();
    renderStatistics();
  });
}

start();
